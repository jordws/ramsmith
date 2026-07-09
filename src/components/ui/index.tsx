import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* -------------------------------------------------- Button */
type ButtonVariant = "primary" | "dark" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 font-display font-semibold rounded-full transition-colors disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-signal text-ink hover:bg-signal-600",
  dark: "bg-ink text-white hover:bg-ink-700",
  outline: "border border-ink/15 bg-white text-ink hover:border-ink/40",
  ghost: "text-ink hover:bg-ink/5",
  danger: "text-danger hover:bg-danger/10",
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-[15px]",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      className={cn(BUTTON_BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], className)}
      {...props}
    />
  );
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  href,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={cn(BUTTON_BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], className)}
      {...props}
    />
  );
}

/* -------------------------------------------------- Inputs */
export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm text-ink",
        "placeholder:text-muted/70 focus:border-ink focus:outline-none focus:ring-0",
        className
      )}
      {...props}
    />
  );
});

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink",
        "placeholder:text-muted/70 focus:border-ink focus:outline-none",
        className
      )}
      {...props}
    />
  );
});

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

/* -------------------------------------------------- Card */
export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-card border border-line bg-white shadow-card",
        className
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------- Badge */
type Tone = "neutral" | "ok" | "warn" | "danger" | "signal";
const TONES: Record<Tone, string> = {
  neutral: "bg-ink/5 text-ink",
  ok: "bg-ok/10 text-ok",
  warn: "bg-warn/10 text-warn",
  danger: "bg-danger/10 text-danger",
  signal: "bg-signal/20 text-ink",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
