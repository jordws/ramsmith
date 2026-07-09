import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/user";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, Badge } from "@/components/ui";
import { UpgradeButton, ManageSubscriptionButton } from "@/components/app/BillingActions";
import { PLANS, PAID_PLANS, hasActiveSubscription } from "@/lib/plans";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata = { title: "Billing — RAMSmith" };

const STATUS_TONE = {
  active: "ok",
  trialing: "ok",
  past_due: "warn",
  incomplete: "warn",
  canceled: "danger",
  none: "neutral",
} as const;

export default async function BillingPage({
  searchParams,
}: {
  searchParams: { checkout?: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const active = hasActiveSubscription(user);
  const currentPlan = PLANS[user.plan];
  const checkout = searchParams.checkout;

  return (
    <div className="container-page py-8">
      <PageHeader eyebrow="Account" title="Billing" />

      {checkout === "success" ? (
        <div className="mt-6 rounded-card border border-ok/30 bg-ok/10 px-5 py-4 text-sm">
          <span className="font-semibold text-ok">Subscription active.</span>{" "}
          Your plan updates within a few seconds of Stripe confirming payment.
        </div>
      ) : null}
      {checkout === "cancelled" ? (
        <div className="mt-6 rounded-card border border-line bg-white px-5 py-4 text-sm text-muted">
          Checkout cancelled — no charge was made.
        </div>
      ) : null}

      {/* Current plan */}
      <Card className="mt-6 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="label-mono">Current plan</span>
            <div className="mt-1 flex items-center gap-3">
              <h2 className="font-display text-2xl font-extrabold">{currentPlan.name}</h2>
              <Badge tone={STATUS_TONE[user.subscriptionStatus] ?? "neutral"}>
                {user.subscriptionStatus.replace("_", " ")}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted">
              {active && user.currentPeriodEnd
                ? `Renews ${formatDate(user.currentPeriodEnd)}`
                : "3 documents included on the free plan."}
            </p>
          </div>
          {user.stripeCustomerId ? <ManageSubscriptionButton /> : null}
        </div>
      </Card>

      {/* Upgrade options */}
      {!active ? (
        <>
          <h2 className="mt-8 font-display text-lg font-bold">Upgrade</h2>
          <div className="mt-3 grid gap-5 md:grid-cols-2">
            {PAID_PLANS.map((plan) => (
              <Card
                key={plan.id}
                className={cn("flex flex-col p-6", plan.highlight ? "ring-2 ring-signal" : "")}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                  {plan.highlight ? <Badge tone="signal">Popular</Badge> : null}
                </div>
                <p className="mt-1 text-sm text-muted">{plan.tagline}</p>
                <div className="mt-4 flex items-end gap-1">
                  <span className="font-display text-3xl font-extrabold">{plan.priceLabel}</span>
                  <span className="pb-1 text-sm text-muted">/mo</span>
                </div>
                <ul className="mt-4 flex-1 space-y-2 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <UpgradeButton
                    plan={plan.id as "SOLO" | "TEAM"}
                    label={`Upgrade to ${plan.name}`}
                    variant={plan.highlight ? "primary" : "dark"}
                  />
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Card className="mt-8 p-6">
          <h3 className="font-display font-bold">You&apos;re on a paid plan</h3>
          <p className="mt-1 text-sm text-muted">
            Manage payment method, invoices, or cancel anytime from the billing
            portal above. Changes sync back automatically.
          </p>
        </Card>
      )}

      <p className="mt-8 text-xs text-muted">
        Payments are processed by Stripe. RAMSmith never stores your card details.
      </p>
    </div>
  );
}
