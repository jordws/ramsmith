import { NextResponse } from "next/server";
import { z } from "zod";
import { stripe, appUrl } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { requireUser, UnauthorizedError } from "@/server/user";

export const runtime = "nodejs";

const schema = z.object({ plan: z.enum(["SOLO", "TEAM"]) });

const PRICE_ENV: Record<"SOLO" | "TEAM", string | undefined> = {
  SOLO: process.env.STRIPE_PRICE_SOLO,
  TEAM: process.env.STRIPE_PRICE_TEAM,
};

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch (e) {
    if (e instanceof UnauthorizedError)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    throw e;
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const priceId = PRICE_ENV[parsed.data.plan];
  if (!priceId) {
    return NextResponse.json(
      { error: `Price for ${parsed.data.plan} is not configured.` },
      { status: 500 }
    );
  }

  // Reuse or create the Stripe customer for this user.
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    // Attach the user id so the webhook can resolve the account reliably.
    subscription_data: { metadata: { userId: user.id } },
    success_url: `${appUrl}/billing?checkout=success`,
    cancel_url: `${appUrl}/billing?checkout=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
