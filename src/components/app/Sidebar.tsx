"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Logo } from "@/components/marketing/Logo";
import { UsageMeter } from "./UsageMeter";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/documents", label: "Documents" },
  { href: "/documents/new", label: "New document" },
  { href: "/billing", label: "Billing" },
  { href: "/settings", label: "Settings" },
];

export function Sidebar({
  name,
  email,
  used,
  limit,
  planName,
}: {
  name: string;
  email: string;
  used: number;
  limit: number | null;
  planName: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-line bg-white md:h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="hazard-rule" />
      <div className="flex items-center justify-between px-5 py-4">
        <Logo />
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:pb-0">
        {NAV.map((item) => {
          const active =
            item.href === "/documents"
              ? pathname === "/documents" || pathname.startsWith("/documents/")
              : pathname === item.href;
          // Keep "New document" from matching the Documents highlight.
          const isNew = item.href === "/documents/new";
          const reallyActive = isNew ? pathname === "/documents/new" : active && !(item.href === "/documents" && pathname === "/documents/new");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                reallyActive ? "bg-ink text-white" : "text-ink/70 hover:bg-ink/5"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden px-4 md:mt-4 md:block">
        <UsageMeter used={used} limit={limit} planName={planName} />
      </div>

      <div className="mt-auto hidden border-t border-line px-4 py-4 md:block">
        <div className="mb-3">
          <div className="truncate text-sm font-medium">{name}</div>
          <div className="truncate text-xs text-muted">{email}</div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm font-medium text-muted hover:text-danger"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
