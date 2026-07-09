import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { LinkButton } from "@/components/ui";
import { PLANS } from "@/lib/plans";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Pricing — RAMSmith",
};

export default function PricingPage() {
  const tiers = [PLANS.FREE, PLANS.SOLO, PLANS.TEAM];
  return (
    <div className="min-h-screen bg-ink">
      <Nav />
      <section className="bg-ink py-16 text-white">
        <div className="hazard-rule" />
        <div className="container-page pt-14 text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Priced to pay for itself on one job.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Every plan includes the full event hazard library, the load plan
            calculator and branded PDF export. No setup fees.
          </p>
        </div>
      </section>

      <section className="bg-paper py-16 text-ink">
        <div className="container-page grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                "flex flex-col rounded-card border bg-white p-7 shadow-card",
                tier.highlight ? "border-ink ring-2 ring-signal" : "border-line"
              )}
            >
              {tier.highlight ? (
                <span className="mb-3 inline-flex w-fit rounded-full bg-signal px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-ink">
                  Most popular
                </span>
              ) : null}
              <h2 className="font-display text-xl font-bold">{tier.name}</h2>
              <p className="mt-1 text-sm text-muted">{tier.tagline}</p>
              <div className="mt-5 flex items-end gap-1">
                <span className="font-display text-4xl font-extrabold">{tier.priceLabel}</span>
                {tier.id !== "FREE" ? <span className="pb-1 text-sm text-muted">/mo</span> : null}
              </div>
              <ul className="mt-6 space-y-2.5 text-sm">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 pt-2">
                <LinkButton
                  href="/register"
                  variant={tier.highlight ? "primary" : "dark"}
                  className="w-full"
                >
                  {tier.id === "FREE" ? "Start free" : `Choose ${tier.name}`}
                </LinkButton>
              </div>
            </div>
          ))}
        </div>
        <p className="container-page mt-8 text-center text-xs text-muted">
          Prices in GBP, billed monthly, cancel anytime from the billing portal.
        </p>
      </section>

      <Footer />
    </div>
  );
}
