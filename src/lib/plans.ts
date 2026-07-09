import type { Plan, SubStatus, User } from "@prisma/client";

export interface PlanDef {
  id: Plan;
  name: string;
  priceLabel: string;
  priceEnv?: "STRIPE_PRICE_SOLO" | "STRIPE_PRICE_TEAM";
  /** Lifetime document cap. null = unlimited. */
  documentLimit: number | null;
  tagline: string;
  features: string[];
  highlight?: boolean;
}

export const PLANS: Record<Plan, PlanDef> = {
  FREE: {
    id: "FREE",
    name: "Free",
    priceLabel: "£0",
    documentLimit: 3,
    tagline: "Kick the tyres on three full documents.",
    features: [
      "3 documents total",
      "Full hazard library",
      "Branded PDF export",
      "Load plan calculator",
    ],
  },
  SOLO: {
    id: "SOLO",
    name: "Solo",
    priceLabel: "£19",
    priceEnv: "STRIPE_PRICE_SOLO",
    documentLimit: null,
    tagline: "For the one-person ops desk.",
    highlight: true,
    features: [
      "Unlimited documents",
      "Editable hazard library",
      "Branded PDF export",
      "Document library & search",
      "Email support",
    ],
  },
  TEAM: {
    id: "TEAM",
    name: "Team",
    priceLabel: "£49",
    priceEnv: "STRIPE_PRICE_TEAM",
    documentLimit: null,
    tagline: "For crews running multiple jobs at once.",
    features: [
      "Everything in Solo",
      "Company branding on every PDF",
      "Shared document library",
      "Priority support",
      "Up to 5 seats (coming soon)",
    ],
  },
};

export const PAID_PLANS: PlanDef[] = [PLANS.SOLO, PLANS.TEAM];

/** A subscription counts as "active" for these Stripe statuses. */
export function isActiveStatus(status: SubStatus): boolean {
  return status === "active" || status === "trialing";
}

/** True when the user has a live paid subscription. */
export function hasActiveSubscription(
  user: Pick<User, "plan" | "subscriptionStatus">
): boolean {
  return user.plan !== "FREE" && isActiveStatus(user.subscriptionStatus);
}

export interface UsageState {
  used: number;
  limit: number | null; // null = unlimited
  remaining: number | null;
  atLimit: boolean;
  plan: PlanDef;
}

export function computeUsage(
  user: Pick<User, "plan" | "subscriptionStatus">,
  documentCount: number
): UsageState {
  // Only honour the paid limit when the subscription is genuinely active;
  // a lapsed subscriber falls back to the free cap.
  const effectivePlan: Plan = hasActiveSubscription(user) ? user.plan : "FREE";
  const plan = PLANS[effectivePlan];
  const limit = plan.documentLimit;
  const remaining = limit === null ? null : Math.max(0, limit - documentCount);
  return {
    used: documentCount,
    limit,
    remaining,
    atLimit: limit !== null && documentCount >= limit,
    plan,
  };
}

/** Resolve a Stripe price ID back to a plan (used by the webhook). */
export function planFromPriceId(priceId: string | null | undefined): Plan {
  if (!priceId) return "FREE";
  if (priceId === process.env.STRIPE_PRICE_SOLO) return "SOLO";
  if (priceId === process.env.STRIPE_PRICE_TEAM) return "TEAM";
  return "FREE";
}
