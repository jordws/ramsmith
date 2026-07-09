"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Field } from "@/components/ui";

export function SettingsForm({
  initialName,
  initialCompany,
}: {
  initialName: string;
  initialCompany: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [company, setCompany] = useState(initialCompany);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);
    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, company }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not save changes.");
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={save} className="space-y-5">
      <Field label="Your name">
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </Field>
      <Field label="Company" hint="Appears on every document you export.">
        <Input value={company} onChange={(e) => setCompany(e.target.value)} />
      </Field>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
        {saved ? <span className="text-sm text-ok">Saved.</span> : null}
        {error ? <span className="text-sm text-danger">{error}</span> : null}
      </div>
    </form>
  );
}
