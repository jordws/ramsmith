import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { LinkButton, Badge } from "@/components/ui";
import { PLANS } from "@/lib/plans";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink">
      <Nav />

      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="hazard-rule" />
        <div className="container-page grid gap-12 py-20 md:grid-cols-[1.1fr_0.9fr] md:py-28">
          <div className="animate-fade-up">
            <span className="label-mono text-signal">For live event production ops</span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Compliant RAMS,
              <br />
              <span className="text-signal">done before the truck loads.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/70">
              Stop rebuilding risk assessments and method statements in Word for
              every job. Answer a guided form, get a branded, sign-off-ready PDF in
              minutes — with a starter hazard library built for events.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <LinkButton href="/register" size="lg">
                Build your first document free
              </LinkButton>
              <LinkButton href="/pricing" size="lg" variant="ghost" className="text-white hover:bg-white/10">
                See pricing
              </LinkButton>
            </div>
            <p className="mt-4 font-mono text-xs text-white/50">
              3 documents free · no card required
            </p>
          </div>

          {/* Mock document card — the product's actual output, previewed. */}
          <div className="animate-fade-up">
            <div className="rounded-card bg-white text-ink shadow-lift">
              <div className="hazard-rule rounded-t-card" />
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <span className="font-display font-extrabold">
                  RAMS<span className="text-signal">·</span>smith
                </span>
                <div className="text-right">
                  <div className="font-mono text-xs text-muted">RA-2026-0042</div>
                  <span className="mt-1 inline-block border border-ink px-2 py-0.5 font-mono text-[10px] font-semibold">
                    APPROVED
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="font-display text-lg font-bold">Arena Load-In · Main Stage</div>
                <div className="text-xs text-muted">Risk Assessment &amp; Method Statement</div>
                <div className="mt-4 space-y-2">
                  {[
                    ["Working at Height", "High", "bg-danger"],
                    ["Vehicles & Plant", "Medium", "bg-warn"],
                    ["Manual Handling", "Low", "bg-ok"],
                  ].map(([name, band, color]) => (
                    <div key={name} className="flex items-center justify-between rounded-lg bg-paper px-3 py-2">
                      <span className="text-sm">{name}</span>
                      <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-semibold text-white ${color}`}>
                        {band}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between rounded-lg border border-line px-3 py-2">
                  <span className="text-xs text-muted">Method statement · 12 steps</span>
                  <span className="font-mono text-sm">Ready to issue</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Problem / stakes ---------------- */}
      <section className="bg-paper py-16 text-ink">
        <div className="container-page grid gap-6 sm:grid-cols-3">
          {[
            ["2–4 hrs", "typical time to hand-build one job's RAMS in Word and Excel"],
            ["Every job", "the same hazards re-typed from scratch, with copy-paste errors"],
            ["Non-compliance", "the risk when a rushed document is missing controls"],
          ].map(([stat, label]) => (
            <div key={stat} className="rounded-card border border-line bg-white p-6 shadow-card">
              <div className="font-display text-3xl font-extrabold">{stat}</div>
              <p className="mt-2 text-sm text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section id="how" className="bg-white py-20 text-ink">
        <div className="container-page">
          <span className="label-mono">The workflow</span>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Three steps, one PDF.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              ["Describe the job", "Event, venue, client, dates on site, and who's preparing the document."],
              ["Pick your hazards", "Start from the event hazard library, edit controls and risk ratings to match the job."],
              ["Export & sign off", "Get a branded PDF with risk table and method statement. Ready to issue."],
            ].map(([title, body], i) => (
              <div key={title} className="relative rounded-card border border-line p-6">
                <span className="font-mono text-sm text-muted">0{i + 1}</span>
                <h3 className="mt-2 font-display text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Features ---------------- */}
      <section id="features" className="bg-paper py-20 text-ink">
        <div className="container-page">
          <span className="label-mono">What you get</span>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Built for the ops desk, not a generic form builder.
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {[
              ["Event hazard library", "Manual handling, working at height, suspended loads, vehicles, weather and more — pre-loaded and fully editable."],
              ["Method statement builder", "Sequence the work step by step, reorder to match the job, and keep it consistent across every document."],
              ["Branded PDF export", "Clean, consistent documents with reference numbers and a document status stamp."],
              ["Document library", "Every job saved and searchable. Re-issue in a click when a booking repeats."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-card border border-line bg-white p-6 shadow-card">
                <h3 className="font-display text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Pricing teaser ---------------- */}
      <section className="bg-ink py-20 text-white">
        <div className="container-page text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Start free. Upgrade when it pays for itself.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            Three documents free. After that, {PLANS.SOLO.priceLabel}/mo for unlimited —
            less than the cost of one lost hour on a job.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Badge tone="signal">Free · 3 docs</Badge>
            <Badge tone="signal">Solo · {PLANS.SOLO.priceLabel}/mo</Badge>
            <Badge tone="signal">Team · {PLANS.TEAM.priceLabel}/mo</Badge>
          </div>
          <div className="mt-8">
            <LinkButton href="/register" size="lg">Create your account</LinkButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
