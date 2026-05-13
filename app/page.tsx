import Link from "next/link";
import { getAllDapps, getAllCategories } from "@/lib/content";
import { CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from "@/lib/labels";
import { DappCard } from "@/components/DappCard";
import { ArrowRight, ArrowUpRight, Compass, Trophy, BarChart3 } from "lucide-react";

export default function HomePage() {
  const allDapps = getAllDapps();
  const featured = allDapps.filter((d) => d.featured).slice(0, 8);
  const categories = getAllCategories();
  const liveCount = allDapps.filter((d) => d.status === "live").length;

  return (
    <>
      <Hero liveCount={liveCount} totalCount={allDapps.length} categoryCount={categories.length} />

      <Ticker dapps={allDapps} />

      {featured.length > 0 && (
        <section className="border-t border-border">
          <div className="container-wide py-16">
            <SectionHeader
              eyebrow="Featured"
              title="Worth your attention"
              description="Hand-picked projects across the ecosystem."
              cta={{ href: "/dapps", label: "View all" }}
            />
            <div className="data-grid sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((dapp, i) => (
                <div
                  key={dapp.slug}
                  className="reveal bg-background"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <DappCard dapp={dapp} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <ThreePillars />

      <section className="border-t border-border">
        <div className="container-wide py-16">
          <SectionHeader
            eyebrow="Categories"
            title="Browse the ecosystem"
            description="Filter by what each project does."
          />
          <div className="data-grid sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/categories/${cat}`}
                className="group flex flex-col gap-2 bg-background p-5 hover-bright hover:bg-muted/50"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold tracking-tight">{CATEGORY_LABELS[cat]}</h3>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {CATEGORY_DESCRIPTIONS[cat]}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}

function Hero({
  liveCount,
  totalCount,
  categoryCount,
}: {
  liveCount: number;
  totalCount: number;
  categoryCount: number;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="container-wide relative py-24 sm:py-32">
        <div className="flex flex-col gap-8">
          <div className="reveal flex items-center gap-2">
            <span className="status-dot status-dot-live" />
            <span className="font-mono text-2xs uppercase tracking-wider text-muted-foreground">
              Fluent Mainnet · Live
            </span>
          </div>

          <h1
            className="reveal max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "60ms" }}
          >
            The front door
            <br />
            to the <span className="text-accent">Fluent</span> ecosystem.
          </h1>

          <p
            className="reveal max-w-2xl text-base leading-relaxed text-subtle sm:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            Every dApp on Fluent, indexed and standardized. Reputation leaderboards and
            network comparison live next to the directory.
          </p>

          <div
            className="reveal flex flex-wrap items-center gap-2"
            style={{ animationDelay: "180ms" }}
          >
            <Link
              href="/dapps"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              Explore the directory
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/leaderboards"
              className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-muted px-5 py-2.5 text-sm font-medium text-foreground hover-bright hover:bg-background-elevated"
            >
              View leaderboards
            </Link>
          </div>

          <div
            className="reveal mt-8 grid grid-cols-3 gap-8 border-t border-border pt-8 sm:flex sm:gap-12"
            style={{ animationDelay: "240ms" }}
          >
            <Stat value={liveCount} label="Live dApps" />
            <Stat value={categoryCount} label="Categories" />
            <Stat value={totalCount} label="Tracked total" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="tabular text-3xl font-semibold tracking-tight sm:text-4xl">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="font-mono text-2xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

/** Auto-scrolling marquee of project names — gives the page a "live" feel */
function Ticker({ dapps }: { dapps: ReturnType<typeof getAllDapps> }) {
  if (dapps.length === 0) return null;
  const items = [...dapps, ...dapps]; // duplicate for seamless loop

  return (
    <div className="overflow-hidden border-b border-border bg-background/40">
      <div className="flex">
        <div className="ticker flex shrink-0 items-center gap-8 py-3 pr-8">
          {items.map((dapp, i) => (
            <div
              key={`${dapp.slug}-${i}`}
              className="flex shrink-0 items-center gap-2 font-mono text-2xs uppercase tracking-wider text-muted-foreground"
            >
              <span className="status-dot status-dot-live" />
              <span>{dapp.name}</span>
              <span className="text-muted-foreground/40">·</span>
              <span className="text-muted-foreground/60">
                {dapp.category}
              </span>
              <span className="mx-4 text-muted-foreground/30">/</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ThreePillars() {
  return (
    <section className="relative border-t border-border">
      <div className="container-wide py-20">
        <div className="mb-12 max-w-2xl">
          <span className="font-mono text-2xs uppercase tracking-wider text-accent">
            What you get here
          </span>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Three views of the
            <br />
            same ecosystem.
          </h2>
        </div>

        <div className="data-grid lg:grid-cols-3">
          <Pillar
            number="01"
            icon={<Compass className="h-4 w-4" />}
            title="Directory"
            description="Every dApp on Fluent with a standardized 'how to participate' template. No marketing fluff — just the six things you actually need to know."
            href="/dapps"
            cta="Browse dApps"
            status="live"
          />
          <Pillar
            number="02"
            icon={<Trophy className="h-4 w-4" />}
            title="Leaderboards"
            description="Multi-context reputation rankings — DeFi, predictors, per-project fandom. Architecture ready, awaiting public Prints contract."
            href="/leaderboards"
            cta="View leaderboards"
            status="soon"
          />
          <Pillar
            number="03"
            icon={<BarChart3 className="h-4 w-4" />}
            title="Network"
            description="Fluent benchmarked against zk-rollup peers. Live revenue from api.fluent.xyz, TVL and activity from DefiLlama."
            href="/network"
            cta="See live data"
            status="live"
          />
        </div>
      </div>
    </section>
  );
}

function Pillar({
  number,
  icon,
  title,
  description,
  href,
  cta,
  status,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  cta: string;
  status: "live" | "soon";
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 bg-background p-7 hover-bright hover:bg-muted/30"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-2xs uppercase tracking-wider text-muted-foreground">
          {number}
        </span>
        <span
          className={
            status === "live"
              ? "flex items-center gap-1.5 font-mono text-2xs uppercase tracking-wider text-success"
              : "flex items-center gap-1.5 font-mono text-2xs uppercase tracking-wider text-muted-foreground"
          }
        >
          <span
            className={
              status === "live" ? "status-dot status-dot-live" : "status-dot status-dot-coming-soon"
            }
          />
          {status === "live" ? "Live" : "Coming soon"}
        </span>
      </div>
      <div className="flex items-center gap-2 text-accent">{icon}</div>
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <div className="flex items-center gap-1.5 text-sm text-foreground transition-transform group-hover:translate-x-0.5">
        {cta}
        <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </Link>
  );
}

function CtaSection() {
  return (
    <section className="border-t border-border">
      <div className="container-wide py-20">
        <div className="relative overflow-hidden rounded-xl border border-border bg-muted/20 p-10 sm:p-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
          <div className="relative flex flex-col gap-4">
            <span className="font-mono text-2xs uppercase tracking-wider text-accent">
              Building on Fluent
            </span>
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Get your project listed
              <br />
              in the directory.
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Listings are managed via pull request. Open one with your project&apos;s details
              and we&apos;ll review within 48 hours.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
              >
                Submit your dApp
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-muted px-5 py-2.5 text-sm font-medium text-foreground hover-bright hover:bg-background-elevated"
              >
                View on GitHub
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  cta,
}: {
  eyebrow: string;
  title: string;
  description: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-2xs uppercase tracking-wider text-accent">{eyebrow}</span>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {cta && (
        <Link
          href={cta.href}
          className="hidden items-center gap-1 text-sm text-muted-foreground hover:text-foreground sm:inline-flex"
        >
          {cta.label}
          <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}
