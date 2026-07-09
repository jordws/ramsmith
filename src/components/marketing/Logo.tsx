import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "font-display text-xl font-extrabold tracking-tight",
        onDark ? "text-white" : "text-ink",
        className
      )}
    >
      RAMS<span className="text-signal">·</span>smith
    </Link>
  );
}
