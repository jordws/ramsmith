import Link from "next/link";
import { cn } from "@/lib/utils";

export function UsageMeter({
  used,
  limit,
  planName,
  className,
}: {
  used: number;
  limit: number | null;
  planName: string;
  className?: string;
}) {
  const unlimited = limit === null;
  const pct = unlimited ? 0 : Math.min(100, Math.round((used / limit) * 100));
  const atLimit = !unlimited && used >= limit;

  return (
    <div className={cn("rounded-card border border-line bg-paper p-4", className)}>
      <div className="flex items-center justify-between">
        <span className="label-mono">Plan · {planName}</span>
      </div>
      <div className="mt-2 font-display text-2xl font-extrabold">
        {used}
        <span className="text-base font-semibold text-muted">
          {unlimited ? " docs" : ` / ${limit}`}
        </span>
      </div>
      {!unlimited ? (
        <>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink/10">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                atLimit ? "bg-danger" : pct > 66 ? "bg-warn" : "bg-signal"
              )}
              style={{ width: `${Math.max(pct, 6)}%` }}
            />
          </div>
          {atLimit ? (
            <Link
              href="/billing"
              className="mt-3 block text-sm font-medium text-ink underline underline-offset-4"
            >
              Limit reached — upgrade
            </Link>
          ) : (
            <p className="mt-2 text-xs text-muted">
              {limit - used} free {limit - used === 1 ? "document" : "documents"} left
            </p>
          )}
        </>
      ) : (
        <p className="mt-2 text-xs text-muted">Unlimited documents</p>
      )}
    </div>
  );
}
