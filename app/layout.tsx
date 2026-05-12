import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    default: "Fluent Hub — The Front Door to the Fluent Ecosystem",
    template: "%s · Fluent Hub",
  },
  description:
    "Discover every dApp on Fluent. Compare network metrics. Track reputation leaderboards across the ecosystem.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} dark`}>
      <body className="font-sans">
        <BackgroundDecoration />
        <Nav />
        <main className="relative z-10 min-h-[calc(100vh-8rem)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

/**
 * The signature background element — a giant, very subtle SVG of three
 * overlapping rings representing Fluent's blended execution (EVM + SVM + Wasm).
 * Sits behind everything, contributes atmosphere without competing for attention.
 * This is the visual identity reference to Fluent without literally being its logo.
 */
function BackgroundDecoration() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <svg
        className="absolute -top-32 left-1/2 -translate-x-1/2 opacity-[0.04]"
        width="1200"
        height="900"
        viewBox="0 0 1200 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="450" cy="450" r="280" stroke="rgb(var(--accent))" strokeWidth="1" />
        <circle cx="600" cy="380" r="280" stroke="rgb(var(--accent))" strokeWidth="1" />
        <circle cx="750" cy="450" r="280" stroke="rgb(var(--accent))" strokeWidth="1" />
        <circle cx="450" cy="450" r="180" stroke="rgb(var(--accent))" strokeWidth="0.5" />
        <circle cx="600" cy="380" r="180" stroke="rgb(var(--accent))" strokeWidth="0.5" />
        <circle cx="750" cy="450" r="180" stroke="rgb(var(--accent))" strokeWidth="0.5" />
      </svg>
      <div className="absolute inset-0 dot-grid opacity-30" />
    </div>
  );
}

function Logomark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        stroke="rgb(var(--accent))"
        strokeWidth="1.5"
      />
      <path d="M8 7H16V9H10V11H15V13H10V17H8V7Z" fill="rgb(var(--accent))" />
    </svg>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="container-wide flex h-14 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-[15px] font-semibold tracking-tight"
        >
          <Logomark />
          <span>Fluent Hub</span>
          <span className="ml-1 hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:inline">
            Beta
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-[13px]">
          <NavLink href="/dapps">Directory</NavLink>
          <NavLink href="/leaderboards">Leaderboards</NavLink>
          <NavLink href="/network">Network</NavLink>
          <Link
            href="/submit"
            className="ml-2 inline-flex items-center gap-1.5 rounded-md border border-border-strong bg-muted px-3 py-1.5 text-[13px] font-medium text-foreground hover-bright hover:bg-background-elevated"
          >
            Submit dApp
          </Link>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-1.5 text-muted-foreground hover-bright hover:bg-muted hover:text-foreground"
    >
      {children}
    </Link>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-border bg-background/40 backdrop-blur-sm">
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Logomark />
              <span className="text-sm font-semibold">Fluent Hub</span>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
              An independent directory for the Fluent ecosystem. Not affiliated with Fluent Labs.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-mono text-2xs uppercase tracking-wider text-muted-foreground">
              Explore
            </span>
            <div className="flex flex-col gap-2 text-xs">
              <Link href="/dapps" className="text-muted-foreground hover:text-foreground">
                Directory
              </Link>
              <Link href="/leaderboards" className="text-muted-foreground hover:text-foreground">
                Leaderboards
              </Link>
              <Link href="/network" className="text-muted-foreground hover:text-foreground">
                Network
              </Link>
              <Link href="/submit" className="text-muted-foreground hover:text-foreground">
                Submit a dApp
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-mono text-2xs uppercase tracking-wider text-muted-foreground">
              Resources
            </span>
            <div className="flex flex-col gap-2 text-xs">
              <a
                href="https://fluent.xyz"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                Fluent ↗
              </a>
              <a
                href="https://docs.fluent.xyz"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                Fluent Docs ↗
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                GitHub ↗
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                Twitter ↗
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-2xs uppercase tracking-wider text-muted-foreground">
            Built for the Fluent ecosystem · 2026
          </p>
          <p className="font-mono text-2xs uppercase tracking-wider text-muted-foreground">
            v0.2 · Open source
          </p>
        </div>
      </div>
    </footer>
  );
}
