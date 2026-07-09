import { Logo } from "./Logo";
import { LinkButton } from "@/components/ui";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo onDark />
        <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          <a href="/#how" className="hover:text-white">How it works</a>
          <a href="/#features" className="hover:text-white">Features</a>
          <a href="/pricing" className="hover:text-white">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          <LinkButton href="/login" variant="ghost" size="sm" className="text-white hover:bg-white/10">
            Log in
          </LinkButton>
          <LinkButton href="/register" size="sm">
            Start free
          </LinkButton>
        </div>
      </div>
    </header>
  );
}
