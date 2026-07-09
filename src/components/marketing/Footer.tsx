import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink py-12 text-white/60">
      <div className="container-page flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <Logo onDark />
          <p className="mt-2 max-w-sm text-sm">
            RAMS and load plans for live event production. A template aid — always
            review and sign off before use.
          </p>
        </div>
        <div className="flex gap-8 text-sm">
          <a href="/pricing" className="hover:text-white">Pricing</a>
          <a href="/login" className="hover:text-white">Log in</a>
          <a href="/register" className="hover:text-white">Start free</a>
        </div>
      </div>
      <div className="container-page mt-8 text-xs text-white/40">
        © {new Date().getFullYear()} RAMSmith. Not legal advice.
      </div>
    </footer>
  );
}
