import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  // Fail loudly in dev so a missing key is obvious rather than silent.
  console.warn(
    "[stripe] STRIPE_SECRET_KEY is not set — billing endpoints will error."
  );
}

// apiVersion is intentionally omitted so the SDK uses its pinned default,
// which avoids coupling this file to a specific Stripe types release.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  typescript: true,
  appInfo: { name: "RAMSmith" },
});

export const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
