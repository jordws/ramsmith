"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Textarea, Field, Card } from "@/components/ui";
import { HAZARD_LIBRARY, VEHICLE_PRESETS } from "@/lib/hazards";
import { riskScore, riskBand, BAND_HEX } from "@/lib/risk";
import { cn, formatKg } from "@/lib/utils";
import type { RamsHazard, LoadItem } from "@/types";

/* Small id helper for client-side rows. */
const rid = () => Math.random().toString(36).slice(2, 9);

const DEFAULT_STEPS = [
  "Attend site induction and confirm the RAMS with all crew before work begins.",
  "Cordon the working area and establish segregated pedestrian and vehicle routes.",
  "Unload vehicles in reverse-rig order using trolleys and tail-lifts; team-lift heavy items.",
  "Rig from the ground up, maintaining exclusion zones beneath any overhead work.",
  "On completion, inspect, sign off, and hand over; reverse the process for breakdown.",
];

type Step = 0 | 1 | 2 | 3;
const STEP_LABELS = ["Job details", "Hazards", "Method", "Load plan"];

export default function NewDocumentPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitHit, setLimitHit] = useState(false);

  // ---- Job details ----
  const [meta, setMeta] = useState({
    title: "",
    eventName: "",
    venue: "",
    client: "",
    siteDates: "",
    preparedBy: "",
    company: "",
  });
  const setMetaField =
    (k: keyof typeof meta) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setMeta((m) => ({ ...m, [k]: e.target.value }));

  // ---- Hazards (start with a sensible default selection) ----
  const [hazards, setHazards] = useState<RamsHazard[]>(() =>
    HAZARD_LIBRARY.slice(0, 4).map((h) => ({ ...h, id: rid(), controls: [...h.controls] }))
  );

  function addHazardFromLibrary(index: number) {
    const t = HAZARD_LIBRARY[index];
    setHazards((hs) => [...hs, { ...t, id: rid(), controls: [...t.controls] }]);
  }
  function addBlankHazard() {
    setHazards((hs) => [
      ...hs,
      {
        id: rid(),
        category: "",
        hazard: "",
        whoAtRisk: "",
        controls: [""],
        likelihood: 3,
        severity: 3,
        residualLikelihood: 2,
        residualSeverity: 2,
      },
    ]);
  }
  function updateHazard(id: string, patch: Partial<RamsHazard>) {
    setHazards((hs) => hs.map((h) => (h.id === id ? { ...h, ...patch } : h)));
  }
  function removeHazard(id: string) {
    setHazards((hs) => hs.filter((h) => h.id !== id));
  }

  // ---- Method steps ----
  const [steps, setSteps] = useState<string[]>(DEFAULT_STEPS);
  function updateStep(i: number, v: string) {
    setSteps((s) => s.map((x, idx) => (idx === i ? v : x)));
  }
  function addStep() {
    setSteps((s) => [...s, ""]);
  }
  function removeStep(i: number) {
    setSteps((s) => s.filter((_, idx) => idx !== i));
  }
  function moveStep(i: number, dir: -1 | 1) {
    setSteps((s) => {
      const j = i + dir;
      if (j < 0 || j >= s.length) return s;
      const copy = [...s];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  }

  // ---- Load plan ----
  const [vehicleIdx, setVehicleIdx] = useState(3); // default 18t Curtainsider
  const [loadItems, setLoadItems] = useState<LoadItem[]>([
    { id: rid(), description: "Line array cabinets (pair, cased)", quantity: 8, weightKg: 190 },
    { id: rid(), description: "Truss — 3m box section", quantity: 12, weightKg: 42 },
    { id: rid(), description: "Flight case — control", quantity: 3, weightKg: 85 },
  ]);
  const [loadNotes, setLoadNotes] = useState("Heaviest items over the axles; strap every layer.");

  const vehicle = VEHICLE_PRESETS[vehicleIdx];
  const totalLoad = useMemo(
    () => loadItems.reduce((s, it) => s + it.quantity * it.weightKg, 0),
    [loadItems]
  );
  const util = vehicle.payloadCapacityKg
    ? Math.round((totalLoad / vehicle.payloadCapacityKg) * 100)
    : 0;
  const overloaded = totalLoad > vehicle.payloadCapacityKg;

  function updateItem(id: string, patch: Partial<LoadItem>) {
    setLoadItems((its) => its.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }
  function addItem() {
    setLoadItems((its) => [...its, { id: rid(), description: "", quantity: 1, weightKg: 0 }]);
  }
  function removeItem(id: string) {
    setLoadItems((its) => its.filter((it) => it.id !== id));
  }

  // ---- Validation per step ----
  function canAdvance(): string | null {
    if (step === 0) {
      if (!meta.title.trim()) return "Give the document a title.";
      if (!meta.eventName.trim()) return "Add the event name.";
      if (!meta.venue.trim()) return "Add the venue or site.";
      if (!meta.preparedBy.trim()) return "Add who prepared this.";
      if (!meta.company.trim()) return "Add your company name.";
    }
    if (step === 1 && hazards.length === 0) return "Add at least one hazard.";
    if (step === 2 && steps.filter((s) => s.trim()).length === 0)
      return "Add at least one method step.";
    return null;
  }

  function next() {
    const problem = canAdvance();
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setStep((s) => Math.min(3, s + 1) as Step);
  }
  function back() {
    setError(null);
    setStep((s) => Math.max(0, s - 1) as Step);
  }

  async function submit() {
    setError(null);
    setSubmitting(true);
    const payload = {
      ...meta,
      content: {
        hazards: hazards.map((h) => ({
          ...h,
          controls: h.controls.map((c) => c.trim()).filter(Boolean),
        })),
        methodSteps: steps.map((s) => s.trim()).filter(Boolean),
        loadPlan: {
          vehicle: vehicle.name,
          payloadCapacityKg: vehicle.payloadCapacityKg,
          items: loadItems.filter((it) => it.description.trim()),
          notes: loadNotes.trim(),
        },
      },
    };

    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status === 402) {
      setSubmitting(false);
      setLimitHit(true);
      return;
    }
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong creating the document.");
      setSubmitting(false);
      return;
    }

    const { document } = await res.json();
    router.push(`/documents/${document.id}`);
    router.refresh();
  }

  if (limitHit) {
    return (
      <div className="container-page py-12">
        <Card className="mx-auto max-w-lg p-8 text-center">
          <div className="hazard-rule mb-6 -mx-8 -mt-8 rounded-t-card" />
          <h1 className="font-display text-2xl font-extrabold">You&apos;ve hit the free limit</h1>
          <p className="mt-2 text-muted">
            Free accounts include three documents. Upgrade to Solo for unlimited
            documents and keep this job moving.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/billing">
              <Button>Upgrade to continue</Button>
            </Link>
            <Link href="/documents">
              <Button variant="outline">Back to library</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          New document
        </h1>
        <Link href="/documents" className="text-sm text-muted hover:text-ink">
          Cancel
        </Link>
      </div>

      {/* Stepper */}
      <div className="mt-6 flex items-center gap-2">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <button
              onClick={() => i < step && setStep(i as Step)}
              className={cn(
                "flex h-8 items-center gap-2 rounded-full px-3 text-sm font-medium transition-colors",
                i === step
                  ? "bg-ink text-white"
                  : i < step
                  ? "bg-signal/20 text-ink"
                  : "bg-ink/5 text-muted"
              )}
            >
              <span className="font-mono text-xs">{i + 1}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            {i < STEP_LABELS.length - 1 ? (
              <div className={cn("h-px flex-1", i < step ? "bg-signal" : "bg-line")} />
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-8">
        {/* STEP 0 — Job details */}
        {step === 0 ? (
          <Card className="p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Document title" hint="What this RAMS covers, e.g. 'Main Stage Load-In'.">
                  <Input value={meta.title} onChange={setMetaField("title")} placeholder="Main Stage Load-In & Rig" />
                </Field>
              </div>
              <Field label="Event name">
                <Input value={meta.eventName} onChange={setMetaField("eventName")} placeholder="Riverside Festival 2026" />
              </Field>
              <Field label="Venue / site">
                <Input value={meta.venue} onChange={setMetaField("venue")} placeholder="Victoria Park, London" />
              </Field>
              <Field label="Client">
                <Input value={meta.client} onChange={setMetaField("client")} placeholder="Riverside Live Ltd" />
              </Field>
              <Field label="Dates on site">
                <Input value={meta.siteDates} onChange={setMetaField("siteDates")} placeholder="Load-in 12 Aug · Show 13–14 · Out 15" />
              </Field>
              <Field label="Prepared by">
                <Input value={meta.preparedBy} onChange={setMetaField("preparedBy")} placeholder="Alex Rigger" />
              </Field>
              <Field label="Company">
                <Input value={meta.company} onChange={setMetaField("company")} placeholder="Northgate Event Services" />
              </Field>
            </div>
          </Card>
        ) : null}

        {/* STEP 1 — Hazards */}
        {step === 1 ? (
          <div className="space-y-4">
            <Card className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display font-bold">Hazard library</h2>
                  <p className="text-sm text-muted">Tap to add. Everything is editable once added.</p>
                </div>
                <Button variant="outline" size="sm" onClick={addBlankHazard}>
                  + Blank hazard
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {HAZARD_LIBRARY.map((t, i) => (
                  <button
                    key={t.category + i}
                    onClick={() => addHazardFromLibrary(i)}
                    className="rounded-full border border-line bg-white px-3 py-1.5 text-sm text-ink transition-colors hover:border-ink/40"
                  >
                    + {t.category}
                  </button>
                ))}
              </div>
            </Card>

            {hazards.map((h) => {
              const initial = riskScore(h.likelihood, h.severity);
              const residual = riskScore(h.residualLikelihood, h.residualSeverity);
              return (
                <Card key={h.id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid flex-1 gap-4 sm:grid-cols-2">
                      <Field label="Category">
                        <Input value={h.category} onChange={(e) => updateHazard(h.id, { category: e.target.value })} />
                      </Field>
                      <Field label="Who's at risk">
                        <Input value={h.whoAtRisk} onChange={(e) => updateHazard(h.id, { whoAtRisk: e.target.value })} />
                      </Field>
                      <div className="sm:col-span-2">
                        <Field label="Hazard description">
                          <Input value={h.hazard} onChange={(e) => updateHazard(h.id, { hazard: e.target.value })} />
                        </Field>
                      </div>
                    </div>
                    <button
                      onClick={() => removeHazard(h.id)}
                      className="shrink-0 text-sm font-medium text-muted hover:text-danger"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Controls */}
                  <div className="mt-4">
                    <span className="mb-1.5 block text-sm font-medium">Control measures</span>
                    <div className="space-y-2">
                      {h.controls.map((c, ci) => (
                        <div key={ci} className="flex gap-2">
                          <Input
                            value={c}
                            onChange={(e) => {
                              const controls = [...h.controls];
                              controls[ci] = e.target.value;
                              updateHazard(h.id, { controls });
                            }}
                            placeholder="Control measure"
                          />
                          <button
                            onClick={() =>
                              updateHazard(h.id, { controls: h.controls.filter((_, x) => x !== ci) })
                            }
                            className="shrink-0 px-2 text-muted hover:text-danger"
                            aria-label="Remove control"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => updateHazard(h.id, { controls: [...h.controls, ""] })}
                      className="mt-2 text-sm font-medium text-ink underline underline-offset-4"
                    >
                      + Add control
                    </button>
                  </div>

                  {/* Risk ratings */}
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <RatingRow
                      label="Initial risk"
                      l={h.likelihood}
                      s={h.severity}
                      onL={(v) => updateHazard(h.id, { likelihood: v })}
                      onS={(v) => updateHazard(h.id, { severity: v })}
                      score={initial}
                    />
                    <RatingRow
                      label="Residual risk (after controls)"
                      l={h.residualLikelihood}
                      s={h.residualSeverity}
                      onL={(v) => updateHazard(h.id, { residualLikelihood: v })}
                      onS={(v) => updateHazard(h.id, { residualSeverity: v })}
                      score={residual}
                    />
                  </div>
                </Card>
              );
            })}

            {hazards.length === 0 ? (
              <Card className="p-8 text-center text-muted">
                No hazards yet. Add from the library above.
              </Card>
            ) : null}
          </div>
        ) : null}

        {/* STEP 2 — Method */}
        {step === 2 ? (
          <Card className="p-5">
            <h2 className="font-display font-bold">Method statement</h2>
            <p className="text-sm text-muted">
              The sequence of work. Reorder to match how the job actually runs.
            </p>
            <div className="mt-4 space-y-2">
              {steps.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="mt-2.5 w-6 shrink-0 font-mono text-sm text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Textarea
                    rows={2}
                    value={s}
                    onChange={(e) => updateStep(i, e.target.value)}
                    placeholder="Describe this step of the work"
                  />
                  <div className="flex shrink-0 flex-col">
                    <button onClick={() => moveStep(i, -1)} className="px-2 text-muted hover:text-ink" aria-label="Move up">↑</button>
                    <button onClick={() => moveStep(i, 1)} className="px-2 text-muted hover:text-ink" aria-label="Move down">↓</button>
                  </div>
                  <button onClick={() => removeStep(i)} className="mt-2 px-2 text-muted hover:text-danger" aria-label="Remove step">✕</button>
                </div>
              ))}
            </div>
            <button onClick={addStep} className="mt-3 text-sm font-medium text-ink underline underline-offset-4">
              + Add step
            </button>
          </Card>
        ) : null}

        {/* STEP 3 — Load plan */}
        {step === 3 ? (
          <Card className="p-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="w-full max-w-xs">
                <Field label="Vehicle" hint="Payload capacity is used to flag overloads.">
                  <select
                    value={vehicleIdx}
                    onChange={(e) => setVehicleIdx(Number(e.target.value))}
                    className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none"
                  >
                    {VEHICLE_PRESETS.map((v, i) => (
                      <option key={v.name} value={i}>
                        {v.name} — {formatKg(v.payloadCapacityKg)}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="text-right">
                <div className="font-mono text-lg font-semibold">
                  {formatKg(totalLoad)} / {formatKg(vehicle.payloadCapacityKg)}
                </div>
                <span
                  className="inline-block rounded px-2 py-0.5 font-mono text-[11px] font-semibold text-white"
                  style={{ backgroundColor: overloaded ? BAND_HEX.High : util > 90 ? BAND_HEX.Medium : BAND_HEX.Low }}
                >
                  {util}% {overloaded ? "OVERLOADED" : "loaded"}
                </span>
              </div>
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink/10">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, util)}%`,
                  backgroundColor: overloaded ? BAND_HEX.High : "#F4C20D",
                }}
              />
            </div>

            <div className="mt-5 space-y-2">
              <div className="hidden grid-cols-[1fr_80px_110px_32px] gap-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted sm:grid">
                <span>Item</span>
                <span>Qty</span>
                <span>Unit kg</span>
                <span />
              </div>
              {loadItems.map((it) => (
                <div key={it.id} className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_80px_110px_32px]">
                  <div className="col-span-2 sm:col-span-1">
                    <Input
                      value={it.description}
                      onChange={(e) => updateItem(it.id, { description: e.target.value })}
                      placeholder="Item description"
                    />
                  </div>
                  <Input
                    type="number"
                    min={0}
                    value={it.quantity}
                    onChange={(e) => updateItem(it.id, { quantity: Number(e.target.value) })}
                  />
                  <Input
                    type="number"
                    min={0}
                    value={it.weightKg}
                    onChange={(e) => updateItem(it.id, { weightKg: Number(e.target.value) })}
                  />
                  <button
                    onClick={() => removeItem(it.id)}
                    className="text-muted hover:text-danger"
                    aria-label="Remove item"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addItem} className="mt-3 text-sm font-medium text-ink underline underline-offset-4">
              + Add item
            </button>

            <div className="mt-5">
              <Field label="Load notes">
                <Textarea rows={2} value={loadNotes} onChange={(e) => setLoadNotes(e.target.value)} />
              </Field>
            </div>
          </Card>
        ) : null}
      </div>

      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}

      {/* Nav controls */}
      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" onClick={back} disabled={step === 0}>
          Back
        </Button>
        {step < 3 ? (
          <Button onClick={next}>Continue</Button>
        ) : (
          <Button onClick={submit} disabled={submitting}>
            {submitting ? "Creating…" : "Create document"}
          </Button>
        )}
      </div>
    </div>
  );
}

/* ---- Likelihood/severity selectors with a live band pill ---- */
function RatingRow({
  label,
  l,
  s,
  onL,
  onS,
  score,
}: {
  label: string;
  l: number;
  s: number;
  onL: (v: number) => void;
  onS: (v: number) => void;
  score: number;
}) {
  const band = riskBand(score);
  return (
    <div className="rounded-xl border border-line p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span
          className="rounded px-2 py-0.5 font-mono text-[11px] font-semibold text-white"
          style={{ backgroundColor: BAND_HEX[band] }}
        >
          {score} {band}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs text-muted">
          Likelihood
          <select
            value={l}
            onChange={(e) => onL(Number(e.target.value))}
            className="mt-1 h-9 w-full rounded-lg border border-line bg-white px-2 text-sm focus:border-ink focus:outline-none"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
        <label className="text-xs text-muted">
          Severity
          <select
            value={s}
            onChange={(e) => onS(Number(e.target.value))}
            className="mt-1 h-9 w-full rounded-lg border border-line bg-white px-2 text-sm focus:border-ink focus:outline-none"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
