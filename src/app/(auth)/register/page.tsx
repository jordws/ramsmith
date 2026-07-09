"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { AuthShell, AuthLink } from "@/components/marketing/AuthShell";
import { Button, Input, Field } from "@/components/ui";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not create your account.");
      setLoading(false);
      return;
    }

    // Auto sign-in after successful registration.
    const signInRes = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);
    if (signInRes?.error) {
      // Account exists but auto-login failed; send them to log in manually.
      router.push("/login");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Build your first three documents free — no card required."
      footer={
        <>
          Already have an account? <AuthLink href="/login">Log in</AuthLink>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Your name">
          <Input required value={form.name} onChange={update("name")} placeholder="Alex Rigger" />
        </Field>
        <Field label="Company" hint="Appears on your exported documents.">
          <Input value={form.company} onChange={update("company")} placeholder="Northgate Event Services" />
        </Field>
        <Field label="Email">
          <Input type="email" autoComplete="email" required value={form.email} onChange={update("email")} placeholder="you@company.com" />
        </Field>
        <Field label="Password" hint="At least 8 characters.">
          <Input type="password" autoComplete="new-password" required minLength={8} value={form.password} onChange={update("password")} placeholder="••••••••" />
        </Field>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
