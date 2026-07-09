import { NextResponse } from "next/server";
import { stripe, appUrl } from "@/lib/stripe";
import { requireUser, UnauthorizedError } from "@/server/user";

export const runtime = "nodejs";

export async function POST() {
  let user;
  try {
    user = await requireUser();
  } catch (e) {
    if (e instanceof UnauthorizedError)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    throw e;
  }

  if (!user.stripeCustomerId) {
    return NextResponse.json(
      { error: "No billing account yet. Subscribe to a plan first." },
      { status: 400 }
    );
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${appUrl}/billing`,
  });

  return NextResponse.json({ url: session.url });
}
