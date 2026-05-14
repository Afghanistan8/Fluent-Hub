import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Layers,
  DollarSign,
} from "lucide-react";
import {
  getCohortMetrics,
  formatTvl,
  formatFees,
  formatChange,
  FLUENT_MAINNET_LAUNCH,
} from "@/lib/defillama";
import { getFluentFees, formatEth, formatUsd } from "@/lib/fluent-api";
import { USDNR_METRICS, formatCount, formatCountUsd } from "@/lib/usdnr";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Network",
  description: "Fluent live metrics and peer comparison.",
};

export const revalidate = 3600;

function daysSinceFluentLaunch(): number {
  const launch = new Date(FLUENT_MAINNET_LAUNCH);
  const now = new Date();
  return Math.floor((now.getTime() - launch.getTime()) / (1000 * 60 * 60 * 24));
}

export default async function NetworkPage() {
  const [fluentFees, metrics] = await Promise.all([getFluentFees(), getCohortMetrics()]);

  const indexed = metrics.filter((m) => m.indexed);
  const fluentEntry = metrics.find((m) => m.slug === "fluent");
  const totalTvl = indexed.reduce((sum, m) => sum + (m.tvl ?? 0), 0);
  const totalProtocols = indexed.reduce((sum, m) => sum + (m.protocols ?? 0), 0);
  const totalFees = metrics.reduce((sum, m) => sum + (m.fees30dUsd ?? 0), 0);
  const daysLive = daysSinceFluentLaunch();

  const sorted = [...metrics].sort((a, b) => {
    if (a.slug === "fluent") return -1;
    if (b.slug === "fluent") return 1;
    return (b.tvl ?? 0) - (a.tvl ?? 0);
  });

  return (
    <div className="container-wide py-20">
      <Link
        href="/"
        className="mb-10 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to home
      </Link>

      <div className="mb-16 flex flex-col gap-3">
        <span className="eyebrow eyebrow-accent">Network</span>
        <h1 className="text-[44px] font-semibold leading-[1.05] tracking-tight sm:text-[56px]">
          Fluent live, peer-compared.
        </h1>
        <p className="max-w-xl text-[15px] text-muted-foreground">
          Direct on-chain metrics from Fluent&apos;s indexer, plus benchmarking against
          zk-rollup peers via DefiLlama.
        </p>
      </div>

      {/* Fluent Live panel */}
      <section className="mb-20">
        <div className="mb-6 flex items-center gap-2">
          <span className="status-dot status-dot-live" />
          <span className="eyebrow eyebrow-accent">Fluent Mainnet · api.fluent.xyz</span>
        </div>

        {fluentFees.ok ? (
          <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
            <FluentMetric
              icon={<Zap className="h-4 w-4" />}
              label="Sequencer fees"
              ethValue={fluentFees.l2FeeEth}
              usdValue={fluentFees.l2FeeEth * fluentFees.ethPriceUsd}
              description="L2 sequencer fees collected since mainnet launch."
            />
            <FluentMetric
              icon={<Layers className="h-4 w-4" />}
              label="Relayer fees"
              ethValue={fluentFees.relayerFeeEth}
              usdValue={fluentFees.relayerFeeEth * fluentFees.ethPriceUsd}
              description="Cross-VM relayer fees from blended execution."
            />
            <FluentMetric
              icon={<DollarSign className="h-4 w-4" />}
              label="Total protocol revenue"
              ethValue={fluentFees.totalFeeEth}
              usdValue={fluentFees.totalFeeUsd}
              description="Sum of all fees flowing to the Fluent protocol."
              highlight
            />
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-background-elevated p-6">
            <p className="text-[14px] text-muted-foreground">
              Fluent indexer temporarily unreachable. Data refreshes every hour.
            </p>
          </div>
        )}

        <p className="mt-4 text-[12px] uppercase tracking-wider text-muted-foreground/70">
          ETH @ ${fluentFees.ethPriceUsd.toFixed(2)} via CoinGecko · refreshed hourly
        </p>
      </section>

      {/* USDnr - live from M0 dashboard methodology */}
      <section className="mb-20">
        <div className="mb-6 flex items-center gap-2">
          <span className="status-dot status-dot-live" />
          <span className="eyebrow eyebrow-accent">USDnr · T-bill rewards</span>
        </div>

        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          <UsdnrMetric
            label="Accrued rewards"
            value={formatCountUsd(USDNR_METRICS.accruedRewardsUsd)}
            sublabel="cumulative · paid to protocol"
            highlight
          />
          <UsdnrMetric
            label="Circulating supply"
            value={formatCount(USDNR_METRICS.circulatingSupply)}
            sublabel="USDnr in circulation"
          />
          <UsdnrMetric
            label="Collateral"
            value={formatCountUsd(USDNR_METRICS.collateralUsd)}
            sublabel="US Treasury Bills · USTB"
          />
          <UsdnrMetric
            label="Holders"
            value={USDNR_METRICS.holders.toString()}
            sublabel="unique addresses"
          />
        </div>

        <div className="mt-6 card flex items-start gap-4 p-6">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
            <DollarSign className="h-4 w-4 text-accent" />
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="text-[15px] font-semibold tracking-tight">
                T-bill yield accruing to the protocol
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                USDnr is Fluent&apos;s native stablecoin, issued by Nerona on M0 infrastructure
                and backed by U.S. Treasury bills. The yield from those reserves accrues to
                the protocol, not to holders directly.
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-3">
              <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                <span className="text-foreground">Methodology.</span> Numbers verified
                from{" "}
                <a
                  href={USDNR_METRICS.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:underline"
                >
                  M0 dashboard
                </a>{" "}
                · observed {USDNR_METRICS.observedOn}. Mirrors{" "}
                <a
                  href="https://blendiction.xyz/revenue"
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:underline"
                >
                  blendiction.xyz/revenue
                </a>
                &apos;s methodology so totals reconcile. Medium-term plan: read USDnr supply
                on-chain via Fluentscan and compute yield directly, removing the manual
                step.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Combined revenue total */}
      <section className="mb-20">
        <div className="mb-6 flex items-center gap-2">
          <span className="eyebrow eyebrow-accent">Total · Fluent protocol revenue</span>
        </div>
        <div className="card flex flex-col gap-3 p-7">
          <span className="num-display text-[44px] font-semibold tracking-tight">
            {formatCountUsd(
              (fluentFees.ok ? fluentFees.totalFeeUsd : 0) +
                USDNR_METRICS.accruedRewardsUsd
            )}
          </span>
          <span className="text-[12px] uppercase tracking-wider text-muted-foreground">
            sequencer + relayer fees + USDnr accrued rewards · cumulative since launch
          </span>
        </div>
      </section>

      {/* Peer comparison */}
      <section>
        <div className="mb-6">
          <span className="eyebrow">Peer cohort · zk-rollups</span>
        </div>

        {fluentEntry?.source === "fluent-indexer" && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-accent/30 bg-accent/[0.04] p-4">
            <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <div>
              <p className="text-[14px] font-medium text-foreground">
                Fluent data from native indexer
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                DefiLlama hasn&apos;t indexed Fluent yet, so revenue is pulled directly from{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[12px]">
                  api.fluent.xyz
                </code>
                . TVL data populates once DefiLlama listing completes.
              </p>
            </div>
          </div>
        )}

        <div className="mb-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
          <AggStat
            label="Cohort TVL"
            value={formatTvl(totalTvl)}
            sublabel={`${indexed.length} chains`}
          />
          <AggStat
            label="Cohort revenue (30d)"
            value={formatFees(totalFees)}
            sublabel="trailing 30d"
          />
          <AggStat
            label="Protocols"
            value={totalProtocols.toLocaleString()}
            sublabel="indexed cohort"
          />
          <AggStat label="Sources" value="2 APIs" sublabel="DefiLlama + Fluent" />
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-12 gap-4 border-b border-border bg-muted/40 px-6 py-4 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            <div className="col-span-3">Chain</div>
            <div className="col-span-3 text-right">TVL</div>
            <div className="col-span-3 text-right">Revenue (30d)</div>
            <div className="col-span-2 text-right">7d</div>
            <div className="col-span-1 text-right">Apps</div>
          </div>
          {sorted.map((chain) => (
            <ChainRow key={chain.slug} chain={chain} />
          ))}
        </div>

        <div className="mt-6 flex items-start gap-2 text-[12px] text-muted-foreground">
          <span className="text-accent">*</span>
          <p className="leading-relaxed">
            Fluent revenue is{" "}
            <span className="text-foreground">cumulative since mainnet launch</span> ({daysLive}{" "}
            days), not a trailing 30-day window. Fluent&apos;s indexer doesn&apos;t yet expose
            time-windowed data.
          </p>
        </div>
      </section>

      <p className="mt-12 text-[11px] uppercase tracking-wider text-muted-foreground/70">
        Sources: api.fluent.xyz · DefiLlama · CoinGecko · refreshed hourly
      </p>
    </div>
  );
}

function FluentMetric({
  icon,
  label,
  ethValue,
  usdValue,
  description,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  ethValue: number;
  usdValue: number;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-7",
        highlight ? "bg-accent/[0.04]" : "bg-background"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="eyebrow">{label}</span>
        <span className={cn("text-muted-foreground", highlight && "text-accent")}>{icon}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <span
          className={cn(
            "num-display text-[36px] font-semibold",
            highlight && "text-accent"
          )}
        >
          {formatUsd(usdValue)}
        </span>
        <span className="text-[12px] font-mono uppercase tracking-wider text-muted-foreground">
          {formatEth(ethValue)}
        </span>
      </div>
      <p className="text-[12px] leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

function AggStat({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel: string;
}) {
  return (
    <div className="flex flex-col gap-2 bg-background p-6">
      <span className="eyebrow">{label}</span>
      <span className="num-display text-[22px] font-semibold">{value}</span>
      <span className="text-[12px] text-muted-foreground">{sublabel}</span>
    </div>
  );
}

function UsdnrMetric({
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
          "num-display text-[26px] font-semibold",
          highlight && "text-accent"
        )}
      >
        {value}
      </span>
      <span className="text-[12px] text-muted-foreground">{sublabel}</span>
    </div>
  );
}

function ChainRow({ chain }: { chain: Awaited<ReturnType<typeof getCohortMetrics>>[0] }) {
  const isFluent = chain.slug === "fluent";
  const change7d = formatChange(chain.change_7d);
  const isNativeSource = chain.source === "fluent-indexer";

  return (
    <div
      className={cn(
        "grid grid-cols-12 items-center gap-4 border-b border-border px-6 py-5 last:border-b-0 hover-bright",
        isFluent ? "bg-accent/[0.04] hover:bg-accent/[0.07]" : "hover:bg-muted/30"
      )}
    >
      <div className="col-span-3 flex items-center gap-3">
        {isFluent && <span className="status-dot status-dot-live shrink-0" />}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "text-[14px] font-semibold tracking-tight",
                isFluent && "text-accent"
              )}
            >
              {chain.displayName}
            </span>
            {isNativeSource && (
              <span
                className="rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent"
                title="Data sourced from api.fluent.xyz"
              >
                Native
              </span>
            )}
          </div>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {chain.slug}
          </span>
        </div>
      </div>
      <div className="col-span-3 text-right">
        <span className="num-display text-[14px] font-medium">
          {chain.tvl === null ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            formatTvl(chain.tvl)
          )}
        </span>
      </div>
      <div className="col-span-3 text-right">
        <span
          className={cn("num-display text-[14px] font-medium", isNativeSource && "text-accent")}
        >
          {chain.fees30dUsd === null ? (
            <span className="text-muted-foreground font-normal">—</span>
          ) : (
            <>
              {formatFees(chain.fees30dUsd)}
              {chain.feesAreCumulative && <span className="ml-1 text-accent">*</span>}
            </>
          )}
        </span>
      </div>
      <div className="col-span-2 text-right">
        <ChangeBadge change={change7d} />
      </div>
      <div className="col-span-1 text-right">
        <span className="num-display text-[13px] text-muted-foreground">
          {chain.protocols ?? "—"}
        </span>
      </div>
    </div>
  );
}

function ChangeBadge({ change }: { change: { text: string; positive: boolean } }) {
  if (change.text === "—") {
    return (
      <span className="inline-flex items-center gap-1 text-[12px] text-muted-foreground">
        <Minus className="h-3 w-3" />—
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 num-display text-[12px] font-medium",
        change.positive ? "text-success" : "text-danger"
      )}
    >
      {change.positive ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {change.text}
    </span>
  );
}
