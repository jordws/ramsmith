import Link from "next/link";
import { Logo } from "./Logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between bg-ink p-10 text-white md:flex">
        <div className="hazard-rule absolute inset-x-0 top-0" />
        <Logo onDark />
        <div>
          <p className="font-display text-3xl font-extrabold leading-tight">
            The ops desk shortcut for compliant paperwork.
          </p>
          <p className="mt-4 max-w-sm text-white/60">
            Guided risk assessments and method statements — branded and
            export-ready in minutes, not hours.
          </p>
        </div>
        <p className="font-mono text-xs text-white/40">
          RA-2026-0042 · APPROVED · Risk Assessment &amp; Method Statement
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-paper px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 md:hidden">
            <Logo />
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
          <div className="mt-6">{children}</div>
          <div className="mt-6 text-sm text-muted">{footer}</div>
        </div>
      </div>
    </div>
  );
}

export function AuthLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-medium text-ink underline underline-offset-4">
      {children}
    </Link>
  );
}
