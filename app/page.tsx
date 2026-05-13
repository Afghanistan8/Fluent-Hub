import Link from "next/link";
import { getAllDapps, getAllCategories } from "@/lib/content";
import { CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from "@/lib/labels";
import { DappCard } from "@/components/DappCard";
import { getFluentFees, formatUsd } from "@/lib/fluent-api";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export const revalidate = 3600;

export default async function HomePage() {
  const [fluentFees, allDapps] = await Promise.all([
    getFluentFees(),
    Promise.resolve(getAllDapps()),
  ]);
  const featured = allDapps.filter((d) => d.featured).slice(0, 6);
  const categories = getAllCategories();
  const liveCount = allDapps.filter((d) => d.status === "live").length;

  return (
    <>
      <Hero
        liveCount={liveCount}
        totalCount={allDapps.length}
        categoryCount={categories.length}
        revenueUsd={fluentFees.ok ? fluentFees.totalFeeUsd : null}
      />

      <Ticker dapps={allDapps} />

      {featured.length > 0 && (
        <section>
          <div className="container-wide py-24">
            <SectionHeader
              eyebrow="Featured"
              title="Worth your attention."
              cta={{ href: "/dapps", label: "View all" }}
            />
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((dapp, i) => (
                <div
                  key={dapp.slug}
                  className="reveal"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <DappCard dapp={dapp} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Pillars />

      <section className="border-t border-border">
        <div className="container-wide py-24">
          <SectionHeader
            eyebrow="Categories"
            title="Browse by what each project does."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, i) => (
              <Link
                key={cat}
                href={`/categories/${cat}`}
                className="card group reveal flex flex-col gap-3 p-6"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-[15px] font-semibold tracking-tight">
                    {CATEGORY_LABELS[cat]}
                  </h3>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
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
  revenueUsd,
}: {
  liveCount: number;
  totalCount: number;
  categoryCount: number;
  revenueUsd: number | null;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Subtle ambient gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-accent/[0.06] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-bg opacity-40"
      />

      <div className="container-wide relative py-28 sm:py-36">
        <div className="flex flex-col gap-10">
          {/* Status pill */}
          <div className="reveal flex items-center gap-2">
            <span className="status-dot status-dot-live" />
            <span className="eyebrow">Fluent Mainnet — Live</span>
          </div>

          {/* The headline - the moment */}
          <h1
            className="reveal max-w-[6em] text-[clamp(2.75rem,7vw,7.5rem)] font-semibold leading-[0.92] tracking-tightest"
            style={{ animationDelay: "80ms" }}
          >
            Everything Fluent,
            <br />
            <span className="text-muted-foreground">in one place.</span>
          </h1>

          {/* Subhead */}
          <p
            className="reveal max-w-xl text-[17px] leading-relaxed text-subtle"
            style={{ animationDelay: "140ms" }}
          >
            An independent hub for the Fluent ecosystem. Live network metrics from{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[14px]">
              api.fluent.xyz
            </code>
            , every dApp indexed and standardized, reputation infrastructure on the way.
          </p>

          {/* CTAs */}
          <div
            className="reveal flex flex-wrap items-center gap-3"
            style={{ animationDelay: "200ms" }}
          >
            <Link
              href="/dapps"
              className="btn-primary inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-[14px] font-medium"
            >
              Explore the directory
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/network"
              className="btn-secondary inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-[14px] font-medium hover-bright"
            >
              See live network data
            </Link>
          </div>

          {/* Data strip - the system status, horizontal */}
          <div
            className="reveal mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4"
            style={{ animationDelay: "260ms" }}
          >
            <DataCell
              label="Live dApps"
              value={liveCount.toString().padStart(2, "0")}
              sublabel={`of ${totalCount} tracked`}
            />
            <DataCell
              label="Categories"
              value={categoryCount.toString().padStart(2, "0")}
              sublabel="ecosystem segments"
            />
            <DataCell
              label="Protocol revenue"
              value={revenueUsd !== null ? formatUsd(revenueUsd) : "—"}
              sublabel="cumulative · live"
              highlight={revenueUsd !== null}
            />
            <DataCell
              label="Data source"
              value="api.fluent.xyz"
              sublabel="refreshed hourly"
              mono
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function DataCell({
  label,
  value,
  sublabel,
  highlight = false,
  mono = false,
}: {
  label: string;
  value: string;
  sublabel: string;
  highlight?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 bg-background p-6">
      <span className="eyebrow">{label}</span>
      <span
        className={
          mono
            ? "num-display font-mono text-[15px] text-foreground"
            : highlight
            ? "num-display text-[28px] font-semibold text-accent"
            : "num-display text-[28px] font-semibold text-foreground"
        }
      >
        {value}
      </span>
      <span className="text-[12px] text-muted-foreground">{sublabel}</span>
    </div>
  );
}

function Ticker({ dapps }: { dapps: ReturnType<typeof getAllDapps> }) {
  if (dapps.length === 0) return null;
  const items = [...dapps, ...dapps];

  return (
    <div className="overflow-hidden border-b border-border">
      <div className="flex">
        <div className="ticker flex shrink-0 items-center gap-10 py-3 pr-10">
          {items.map((dapp, i) => (
            <div
              key={`${dapp.slug}-${i}`}
              className="flex shrink-0 items-center gap-2 text-[12px] text-muted-foreground"
            >
              <span className="status-dot status-dot-live" />
              <span className="font-medium text-foreground/80">{dapp.name}</span>
              <span className="text-muted-foreground/40">·</span>
              <span className="font-mono uppercase tracking-wider text-[10px]">
                {dapp.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Pillars() {
  const pillars = [
    {
      number: "01",
      title: "Directory",
      description:
        "Every dApp on Fluent with a standardized 'how to participate' template. No marketing fluff.",
      href: "/dapps",
      cta: "Browse dApps",
      status: "live" as const,
    },
    {
      number: "02",
      title: "Network",
      description:
        "Live protocol revenue from api.fluent.xyz. Benchmarked against zk-rollup peers.",
      href: "/network",
      cta: "See live data",
      status: "live" as const,
    },
    {
      number: "03",
      title: "Leaderboards",
      description:
        "Multi-context reputation rankings. Architecture ready, awaiting public Prints contract.",
      href: "/leaderboards",
      cta: "View plan",
      status: "soon" as const,
    },
  ];

  return (
    <section className="border-t border-border">
      <div className="container-wide py-24">
        <SectionHeader eyebrow="Built around" title="Three views of one ecosystem." />
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {pillars.map((p, i) => (
            <Link
              key={p.number}
              href={p.href}
              className="card group reveal flex flex-col gap-5 p-7"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] tabular text-muted-foreground">
                  {p.number}
                </span>
                <span
                  className={
                    p.status === "live"
                      ? "flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-success"
                      : "flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
                  }
                >
                  <span
                    className={
                      p.status === "live"
                        ? "status-dot status-dot-live"
                        : "status-dot status-dot-coming-soon"
                    }
                  />
                  {p.status === "live" ? "Live" : "Soon"}
                </span>
              </div>
              <h3 className="text-[24px] font-semibold tracking-tight">{p.title}</h3>
              <p className="flex-1 text-[14px] leading-relaxed text-muted-foreground">
                {p.description}
              </p>
              <div className="flex items-center gap-1.5 text-[13px] text-foreground transition-transform group-hover:translate-x-0.5">
                {p.cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="border-t border-border">
      <div className="container-wide py-24">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-background-elevated">
          <div
            aria-hidden="true"
            className="absolute inset-0 grid-bg opacity-50"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
          />
          <div className="relative flex flex-col gap-6 p-10 sm:p-14">
            <span className="eyebrow eyebrow-accent">Building on Fluent</span>
            <h2 className="max-w-2xl text-[36px] font-semibold leading-[1.05] tracking-tight sm:text-[48px]">
              Get your project listed
              <br />
              in the directory.
            </h2>
            <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              Listings are managed via pull request. Open one with your project&apos;s details
              and we&apos;ll review within 48 hours.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Link
                href="/submit"
                className="btn-primary inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-[14px] font-medium"
              >
                Submit your dApp
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href="https://github.com/Afghanistan8/fluent-hub"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-[14px] font-medium hover-bright"
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
  cta,
}: {
  eyebrow: string;
  title: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="flex flex-col gap-3">
        <span className="eyebrow eyebrow-accent">{eyebrow}</span>
        <h2 className="text-[36px] font-semibold leading-[1.05] tracking-tight sm:text-[44px]">
          {title}
        </h2>
      </div>
      {cta && (
        <Link
          href={cta.href}
          className="hidden items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground sm:inline-flex"
        >
          {cta.label}
          <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}
