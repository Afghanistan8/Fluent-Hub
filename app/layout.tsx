import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    default: "Fluent Hub — Everything Fluent in one place",
    template: "%s · Fluent Hub",
  },
  description:
    "The ecosystem hub for Fluent. Live network metrics, dApp directory, reputation infrastructure.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans">
        <BackgroundRings />
        <Nav />
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

/**
 * Stylized geometric reference to Fluent's blended execution motif.
 * Three overlapping rings represent the three VMs (EVM + SVM + Wasm).
 * Positioned bottom-right at low opacity as decorative atmosphere.
 * Not Fluent's actual logo — a defensible visual reference to their thesis.
 */
function BackgroundRings() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <svg
        className="absolute -right-40 -bottom-40 opacity-[0.05]"
        width="800"
        height="800"
        viewBox="0 0 800 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="280" cy="400" r="220" stroke="rgb(var(--accent))" strokeWidth="1.5" />
        <circle cx="400" cy="320" r="220" stroke="rgb(var(--accent))" strokeWidth="1.5" />
        <circle cx="520" cy="400" r="220" stroke="rgb(var(--accent))" strokeWidth="1.5" />
        <circle cx="280" cy="400" r="140" stroke="rgb(var(--accent))" strokeWidth="0.75" />
        <circle cx="400" cy="320" r="140" stroke="rgb(var(--accent))" strokeWidth="0.75" />
        <circle cx="520" cy="400" r="140" stroke="rgb(var(--accent))" strokeWidth="0.75" />
        <circle cx="280" cy="400" r="60" stroke="rgb(var(--accent))" strokeWidth="0.5" />
        <circle cx="400" cy="320" r="60" stroke="rgb(var(--accent))" strokeWidth="0.5" />
        <circle cx="520" cy="400" r="60" stroke="rgb(var(--accent))" strokeWidth="0.5" />
      </svg>
      <svg
        className="absolute -left-32 -top-32 opacity-[0.04]"
        width="600"
        height="600"
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="200" cy="300" r="180" stroke="rgb(var(--accent))" strokeWidth="1" />
        <circle cx="300" cy="220" r="180" stroke="rgb(var(--accent))" strokeWidth="1" />
        <circle cx="400" cy="300" r="180" stroke="rgb(var(--accent))" strokeWidth="1" />
      </svg>
      <div className="absolute inset-0 grid-bg opacity-50" />
    </div>
  );
}

function Logomark({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
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
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container-wide flex h-14 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 text-[14px] font-semibold tracking-tight">
            <Logomark />
            <span>Fluent Hub</span>
          </Link>
          <span className="hidden items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-accent sm:inline-flex">
            <span className="h-1 w-1 rounded-full bg-accent" />
            Built for Fluent
          </span>
        </div>
        <nav className="flex items-center gap-1 text-[13px]">
          <NavLink href="/dapps">Directory</NavLink>
          <NavLink href="/network">Network</NavLink>
          <NavLink href="/leaderboards">Leaderboards</NavLink>
          <Link
            href="/submit"
            className="btn-secondary ml-3 inline-flex items-center rounded-md px-3 py-1.5 text-[13px] font-medium hover-bright"
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
      className="rounded-md px-3 py-1.5 text-muted-foreground hover-bright hover:text-foreground"
    >
      {children}
    </Link>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-border bg-background/60 backdrop-blur-sm">
      <div className="container-wide py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-3 max-w-sm">
            <Logomark />
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              An independent hub for the Fluent ecosystem. Not affiliated with Fluent Labs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12">
            <div className="flex flex-col gap-3">
              <span className="eyebrow">Explore</span>
              <Link href="/dapps" className="text-[13px] text-muted-foreground hover:text-foreground">Directory</Link>
              <Link href="/network" className="text-[13px] text-muted-foreground hover:text-foreground">Network</Link>
              <Link href="/leaderboards" className="text-[13px] text-muted-foreground hover:text-foreground">Leaderboards</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="eyebrow">Resources</span>
              <a href="https://fluent.xyz" target="_blank" rel="noreferrer" className="text-[13px] text-muted-foreground hover:text-foreground">Fluent</a>
              <a href="https://docs.fluent.xyz" target="_blank" rel="noreferrer" className="text-[13px] text-muted-foreground hover:text-foreground">Docs</a>
              <a href="https://github.com/Afghanistan8/fluent-hub" target="_blank" rel="noreferrer" className="text-[13px] text-muted-foreground hover:text-foreground">GitHub</a>
            </div>
          </div>
        </div>
        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <span className="eyebrow">© 2026 Fluent Hub</span>
          <span className="eyebrow">v1.1</span>
        </div>
      </div>
    </footer>
  );
}
