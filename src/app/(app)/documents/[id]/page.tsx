import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/server/user";
import { getDocument } from "@/server/documents";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, Badge, LinkButton } from "@/components/ui";
import { DeleteDocumentButton } from "@/components/app/DeleteDocumentButton";
import { riskScore, riskBand, BAND_HEX } from "@/lib/risk";
import { formatDate, formatKg } from "@/lib/utils";
import type { DocumentContent } from "@/types";

function RiskPill({ score }: { score: number }) {
  const band = riskBand(score);
  return (
    <span
      className="inline-flex min-w-[64px] justify-center rounded px-2 py-0.5 font-mono text-[11px] font-semibold text-white"
      style={{ backgroundColor: BAND_HEX[band] }}
    >
      {score} {band}
    </span>
  );
}

export default async function DocumentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const doc = await getDocument(user.id, params.id);
  if (!doc) notFound();

  const content: DocumentContent = {
    hazards: doc.hazards as unknown as DocumentContent["hazards"],
    loadPlan: doc.loadPlan as unknown as DocumentContent["loadPlan"],
    methodSteps: doc.methodSteps as unknown as DocumentContent["methodSteps"],
  };

  const totalLoad = content.loadPlan.items.reduce(
    (s, it) => s + it.quantity * it.weightKg,
    0
  );
  const cap = content.loadPlan.payloadCapacityKg;
  const overloaded = cap > 0 && totalLoad > cap;
  const util = cap > 0 ? Math.round((totalLoad / cap) * 100) : 0;

  return (
    <div className="container-page py-8">
      <Link href="/documents" className="text-sm text-muted hover:text-ink">
        ← Back to documents
      </Link>

      <div className="mt-4">
        <PageHeader
          eyebrow={doc.ref}
          title={doc.title}
          action={
            <div className="flex items-center gap-2">
              <DeleteDocumentButton id={doc.id} />
              <LinkButton
                href={`/api/documents/${doc.id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open PDF
              </LinkButton>
            </div>
          }
        />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Badge tone={doc.status === "APPROVED" ? "ok" : "neutral"}>{doc.status}</Badge>
        <span className="text-sm text-muted">Issued {formatDate(doc.createdAt)}</span>
      </div>

      {/* Meta */}
      <Card className="mt-6 grid gap-4 p-6 sm:grid-cols-3">
        {[
          ["Event", doc.eventName],
          ["Venue / site", doc.venue],
          ["Client", doc.client || "—"],
          ["Dates on site", doc.siteDates || "—"],
          ["Prepared by", doc.preparedBy],
          ["Company", doc.company],
        ].map(([label, value]) => (
          <div key={label}>
            <div className="label-mono">{label}</div>
            <div className="mt-0.5 text-sm">{value}</div>
          </div>
        ))}
      </Card>

      {/* Risk assessment */}
      <h2 className="mt-8 font-display text-lg font-bold">Risk assessment</h2>
      <Card className="mt-3 overflow-hidden">
        <div className="hidden grid-cols-[1.6fr_0.8fr_1.8fr_auto_auto] gap-4 border-b border-line bg-paper px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted md:grid">
          <span>Hazard</span>
          <span>Who</span>
          <span>Controls</span>
          <span className="text-center">Initial</span>
          <span className="text-center">Residual</span>
        </div>
        <div className="divide-y divide-line">
          {content.hazards.map((h) => (
            <div key={h.id} className="grid gap-3 px-5 py-4 md:grid-cols-[1.6fr_0.8fr_1.8fr_auto_auto] md:items-start md:gap-4">
              <div>
                <div className="font-medium">{h.category}</div>
                <div className="text-sm text-muted">{h.hazard}</div>
              </div>
              <div className="text-sm text-muted">{h.whoAtRisk}</div>
              <ul className="space-y-1 text-sm text-muted">
                {h.controls.map((c, i) => (
                  <li key={i}>• {c}</li>
                ))}
              </ul>
              <div className="md:pt-0.5"><RiskPill score={riskScore(h.likelihood, h.severity)} /></div>
              <div className="md:pt-0.5"><RiskPill score={riskScore(h.residualLikelihood, h.residualSeverity)} /></div>
            </div>
          ))}
        </div>
      </Card>

      {/* Method statement */}
      <h2 className="mt-8 font-display text-lg font-bold">Method statement</h2>
      <Card className="mt-3 divide-y divide-line">
        {content.methodSteps.map((step, i) => (
          <div key={i} className="flex gap-4 px-5 py-3">
            <span className="font-mono text-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-sm">{step}</span>
          </div>
        ))}
      </Card>

      {/* Load plan */}
      <h2 className="mt-8 font-display text-lg font-bold">Vehicle load plan</h2>
      <Card className="mt-3 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="label-mono">Vehicle</div>
            <div className="mt-0.5 font-medium">{content.loadPlan.vehicle}</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-lg font-semibold">
              {formatKg(totalLoad)} / {formatKg(cap)}
            </div>
            <Badge tone={overloaded ? "danger" : util > 90 ? "warn" : "ok"}>
              {util}% {overloaded ? "overloaded" : "loaded"}
            </Badge>
          </div>
        </div>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-ink/10">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min(100, util)}%`,
              backgroundColor: overloaded ? BAND_HEX.High : "#F4C20D",
            }}
          />
        </div>

        <div className="mt-5 divide-y divide-line">
          {content.loadPlan.items.map((it) => (
            <div key={it.id} className="flex items-center justify-between py-2 text-sm">
              <span>{it.description}</span>
              <span className="font-mono text-muted">
                {it.quantity} × {formatKg(it.weightKg)} = {formatKg(it.quantity * it.weightKg)}
              </span>
            </div>
          ))}
        </div>
        {content.loadPlan.notes ? (
          <p className="mt-4 text-sm text-muted">Notes: {content.loadPlan.notes}</p>
        ) : null}
      </Card>

      <p className="mt-8 text-xs text-muted">
        RAMSmith documents are a template aid, not legal advice. Review and sign off
        before issue.
      </p>
    </div>
  );
}
