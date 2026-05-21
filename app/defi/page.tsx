import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowUpRight,
  TrendingUp,
  Info,
  Layers,
  ExternalLink,
} from "lucide-react";
import { getDappsByCategory } from "@/lib/content";
import { STATUS_LABELS } from "@/lib/labels";
import { getSusdnrMetrics, formatTokenSupply, SUSDNR_CONTRACT } from "@/lib/susdnr";
import { USDNR_METRICS, formatCountUsd } from "@/lib/usdnr";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "DeFi",
  description:
    "Yield, lending, and staking on Fluent. Live data where available, curated where not.",
};

export const revalidate = 3600;

export default async function DefiPage() {
  const defiDapps = getDappsByCategory("defi");
  const susdnr = await getSusdnrMetrics();

  // Live data rows we can actually populate
  const liveRows: LiveRow[] = [];

  if (susdnr.ok) {
    liveRows.push({
      asset: "sUSDnr",
      assetDescription: "Staked USDnr (T-bill backed)",
      protocol: "Nerona / Upshift",
      protocolHref: "https://app.nerona.xyz",
      tvlDisplay: formatCountUsd(USDNR_METRICS.collateralUsd),
      tvlNote: "USTB collateral",
      supplyDisplay: `${formatTokenSupply(susdnr.totalSupply)} ${susdnr.symbol}`,
      holders: susdnr.holders,
      contractAddress: SUSDNR_CONTRACT,
      type: "staking",
    });
  }

  return (
    <div className="container-wide py-20">
      <Link
        href="/"
        className="mb-10 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to home
      </Link>

      <div className="reveal flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="eyebrow eyebrow-accent">DeFi</span>
          <span className="rounded border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-success">
            Live
          </span>
        </div>
        <h1 className="text-[44px] font-semibold leading-[1.05] tracking-tight sm:text-[56px]">
          DeFi on Fluent.
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Yield, lending, and staking across Fluent&apos;s ecosystem. Live on-chain data
          where protocols expose endpoints — curated directory entries for everything
          else. No fabricated APYs, no fake liquidity numbers.
        </p>
      </div>

      {/* Summary stats */}
      <section
        className="reveal mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4"
        style={{ animationDelay: "80ms" }}
      >
        <SummaryStat
          label="DeFi protocols"
          value={defiDapps.length.toString()}
          sublabel="in directory"
        />
        <SummaryStat
          label="Live data rows"
          value={liveRows.length.toString()}
          sublabel="on-chain sourced"
        />
        <SummaryStat
          label="USTB collateral"
          value={formatCountUsd(USDNR_METRICS.collateralUsd)}
          sublabel="backing USDnr"
          highlight
        />
        <SummaryStat
          label="Data sources"
          value="3"
          sublabel="Fluentscan, M0, Indexer"
        />
      </section>

      {/* LIVE DATA SECTION */}
      <section className="reveal mt-16" style={{ animationDelay: "160ms" }}>
        <div className="mb-6 flex flex-col gap-2">
          <span className="eyebrow eyebrow-accent">Live</span>
          <h2 className="text-[28px] font-semibold tracking-tight">
            On-chain yield positions
          </h2>
          <p className="text-[14px] text-muted-foreground">
            Real data, read directly from Fluent. APY shown only where protocols expose
            it transparently.
          </p>
        </div>

        {liveRows.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="hidden grid-cols-12 gap-4 border-b border-border bg-muted/40 px-6 py-4 text-[11px] font-medium uppercase tracking-wider text-muted-foreground md:grid">
              <div className="col-span-3">Asset</div>
              <div className="col-span-3">Protocol</div>
              <div className="col-span-2 text-right">TVL / Collateral</div>
              <div className="col-span-2 text-right">Supply</div>
              <div className="col-span-1 text-right">Holders</div>
              <div className="col-span-1 text-right">Action</div>
            </div>
            {liveRows.map((row, i) => (
              <LiveRowComponent key={i} row={row} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-background-elevated p-6">
            <p className="text-[14px] text-muted-foreground">
              No on-chain data sources reachable right now. Refreshes hourly.
            </p>
          </div>
        )}

        <p className="mt-4 text-[11px] uppercase tracking-wider text-muted-foreground/70">
          Sourced from Fluentscan · refreshed hourly
        </p>
      </section>

      {/* CURATED DIRECTORY SECTION */}
      <section className="reveal mt-20" style={{ animationDelay: "240ms" }}>
        <div className="mb-6 flex flex-col gap-2">
          <span className="eyebrow eyebrow-accent">Directory</span>
          <h2 className="text-[28px] font-semibold tracking-tight">
            All DeFi on Fluent
          </h2>
          <p className="text-[14px] text-muted-foreground">
            Every DeFi protocol indexed in the directory. Click through for the standardized
            &quot;how to participate&quot; breakdown.
          </p>
        </div>

        {defiDapps.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {defiDapps.map((dapp, i) => (
              <Link
                key={dapp.slug}
                href={`/dapps/${dapp.slug}`}
                className="card group reveal flex items-start gap-4 p-5"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-background">
                  <Image
                    src={dapp.logo}
                    alt={`${dapp.name} logo`}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate text-[15px] font-semibold tracking-tight">
                      {dapp.name}
                    </h3>
                    <span className="flex shrink-0 items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      <span
                        className={cn(
                          "status-dot",
                          dapp.status === "live"
                            ? "status-dot-live"
                            : dapp.status === "testnet"
                            ? "status-dot-testnet"
                            : dapp.status === "coming-soon"
                            ? "status-dot-coming-soon"
                            : "status-dot-deprecated"
                        )}
                      />
                      {STATUS_LABELS[dapp.status]}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                    {dapp.tagline}
                  </p>
                  {dapp.subcategory && (
                    <span className="mt-1 inline-flex w-fit items-center rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {dapp.subcategory}
                    </span>
                  )}
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-background-elevated p-6">
            <p className="text-[14px] text-muted-foreground">
              No DeFi protocols in the directory yet. Want yours listed?{" "}
              <Link href="/submit" className="text-accent hover:underline">
                Submit it
              </Link>
              .
            </p>
          </div>
        )}
      </section>

      {/* Methodology note */}
      <section
        className="reveal mt-16 rounded-xl border border-border bg-background-elevated p-6"
        style={{ animationDelay: "320ms" }}
      >
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <div className="flex flex-col gap-3">
            <h3 className="text-[15px] font-semibold tracking-tight">
              About the data
            </h3>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              The live section reads directly from on-chain sources (Fluentscan) and
              transparent dashboards (M0). APYs aren&apos;t displayed for protocols that
              don&apos;t expose them via a public API — we don&apos;t fabricate yield
              numbers, and we don&apos;t copy them from screenshots.
            </p>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              The directory section pulls from the same content that powers{" "}
              <Link href="/dapps" className="text-accent hover:underline">
                fluenteco.xyz/dapps
              </Link>
              . As more Fluent DeFi protocols expose public endpoints, they&apos;ll graduate
              from the directory to the live section.
            </p>
          </div>
        </div>
      </section>

      <p className="mt-12 text-[11px] uppercase tracking-wider text-muted-foreground/70">
        Sources: Fluentscan · M0 dashboard · Fluent indexer · refreshed hourly
      </p>
    </div>
  );
}

type LiveRow = {
  asset: string;
  assetDescription: string;
  protocol: string;
  protocolHref: string;
  tvlDisplay: string;
  tvlNote: string;
  supplyDisplay: string;
  holders: number | null;
  contractAddress: string;
  type: "staking" | "lending" | "yield";
};

function LiveRowComponent({ row }: { row: LiveRow }) {
  return (
    <div className="grid grid-cols-1 gap-4 border-b border-border px-6 py-5 last:border-b-0 md:grid-cols-12 md:items-center">
      <div className="md:col-span-3">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold">{row.asset}</span>
          <span className="rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-accent">
            {row.type}
          </span>
        </div>
        <span className="mt-0.5 block text-[11px] text-muted-foreground">
          {row.assetDescription}
        </span>
      </div>
      <div className="md:col-span-3">
        <a
          href={row.protocolHref}
          target="_blank"
          rel="noreferrer"
          className="text-[14px] font-medium text-foreground hover:text-accent"
        >
          {row.protocol}
        </a>
      </div>
      <div className="md:col-span-2 md:text-right">
        <span className="md:hidden text-[11px] text-muted-foreground">TVL: </span>
        <span className="num-display text-[14px] font-medium">{row.tvlDisplay}</span>
        <span className="ml-1 text-[11px] text-muted-foreground">{row.tvlNote}</span>
      </div>
      <div className="md:col-span-2 md:text-right">
        <span className="md:hidden text-[11px] text-muted-foreground">Supply: </span>
        <span className="num-display text-[13px] text-muted-foreground">
          {row.supplyDisplay}
        </span>
      </div>
      <div className="md:col-span-1 md:text-right">
        <span className="md:hidden text-[11px] text-muted-foreground">Holders: </span>
        <span className="num-display text-[13px] text-muted-foreground">
          {row.holders ?? "—"}
        </span>
      </div>
      <div className="md:col-span-1 md:text-right">
        <a
          href={`https://fluentscan.xyz/address/${row.contractAddress}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[12px] text-muted-foreground hover:text-accent"
        >
          Contract
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

function SummaryStat({
  label,
  value,
  sublabel,
  highlight = false,
}: {
  label: string;
  value: string;
  sublabel: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-6",
        highlight ? "bg-accent/[0.04]" : "bg-background"
      )}
    >
      <span className="eyebrow">{label}</span>
      <span
        className={cn(
          "num-display text-[22px] font-semibold",
          highlight && "text-accent"
        )}
      >
        {value}
      </span>
      <span className="text-[12px] text-muted-foreground">{sublabel}</span>
    </div>
  );
}
