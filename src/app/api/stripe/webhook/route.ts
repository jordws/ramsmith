import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { planFromPriceId } from "@/lib/plans";
import type { SubStatus } from "@prisma/client";

export const runtime = "nodejs";
// The raw body is required for signature verification, so never cache/parse.
export const dynamic = "force-dynamic";

const RELEVANT = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

function mapStatus(status: Stripe.Subscription.Status): SubStatus {
  switch (status) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
      return "past_due";
    case "canceled":
    case "unpaid":
      return "canceled";
    case "incomplete":
    case "incomplete_expired":
    case "paused":
      return "incomplete";
    default:
      return "none";
  }
}

/** Write the current subscription state onto the matching user. */
async function syncSubscription(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const priceId = subscription.items.data[0]?.price.id ?? null;
  const status = mapStatus(subscription.status);
  const plan =
    status === "canceled" ? "FREE" : planFromPriceId(priceId);

  // Resolve the user by metadata first, then by stored customer id.
  const metaUserId = subscription.metadata?.userId;
  const user =
    (metaUserId
      ? await prisma.user.findUnique({ where: { id: metaUserId } })
      : null) ??
    (await prisma.user.findUnique({ where: { stripeCustomerId: customerId } }));

  if (!user) {
    console.warn("[webhook] no user for customer", customerId);
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      plan,
      subscriptionStatus: status,
      currentPeriodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : null,
    },
  });
}

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return NextResponse.json(
      { error: "Missing webhook signature or secret" },
      { status: 400 }
    );
  }

  const payload = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    console.error("[webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (!RELEVANT.has(event.type)) {
    return NextResponse.json({ received: true });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.subscription) {
        const sub = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        await syncSubscription(sub);
      }
    } else {
      await syncSubscription(event.data.object as Stripe.Subscription);
    }
  } catch (err) {
    console.error("[webhook] handler error", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
