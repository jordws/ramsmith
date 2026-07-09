"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

async function post(url: string, body?: object) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
  return data as { url?: string };
}

export function UpgradeButton({
  plan,
  label,
  variant = "primary",
}: {
  plan: "SOLO" | "TEAM";
  label: string;
  variant?: "primary" | "dark" | "outline";
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    setLoading(true);
    setError(null);
    try {
      const { url } = await post("/api/stripe/checkout", { plan });
      if (url) window.location.href = url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div>
      <Button variant={variant} className="w-full" onClick={go} disabled={loading}>
        {loading ? "Redirecting…" : label}
      </Button>
      {error ? <p className="mt-2 text-xs text-danger">{error}</p> : null}
    </div>
  );
}

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    setLoading(true);
    setError(null);
    try {
      const { url } = await post("/api/stripe/portal");
      if (url) window.location.href = url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div>
      <Button variant="dark" onClick={go} disabled={loading}>
        {loading ? "Opening…" : "Manage subscription"}
      </Button>
      {error ? <p className="mt-2 text-xs text-danger">{error}</p> : null}
    </div>
  );
}
