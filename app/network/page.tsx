import Link from "next/link";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Zap, Layers, DollarSign } from "lucide-react";
import { getCohortMetrics, formatTvl, formatFees, formatChange, FLUENT_MAINNET_LAUNCH } from "@/lib/defillama";
import { getFluentFees, formatEth, formatUsd } from "@/lib/fluent-api";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Network",
  description: "Fluent live metrics + benchmarked against zk-rollup peers.",
};

export const revalidate = 3600;

// Days Fluent has been live (used in footnote)
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
    <div className="container-wide py-14">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to home
      </Link>

      <div className="mb-12 flex flex-col gap-3">
        <span className="font-mono text-2xs uppercase tracking-wider text-accent">Network</span>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Fluent live · Peer comparison
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Direct on-chain metrics from Fluent&apos;s indexer, plus benchmarking against
          zk-rollup peers via DefiLlama.
        </p>
      </div>

      {/* Fluent Live panel */}
      <section className="mb-16">
        <div className="mb-5 flex items-center gap-2">
          <span className="status-dot status-dot-live" />
          <span className="font-mono text-2xs uppercase tracking-wider text-accent">
            Fluent Mainnet · Live from api.fluent.xyz
          </span>
        </div>

        {fluentFees.ok ? (
          <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
            <FluentMetric
              icon={<Zap className="h-4 w-4" />}
              label="Sequencer fees (L2)"
              ethValue={fluentFees.l2FeeEth}
              usdValue={fluentFees.l2FeeEth * fluentFees.ethPriceUsd}
              description="Cumulative L2 sequencer fees collected since mainnet launch."
            />
            <FluentMetric
              icon={<Layers className="h-4 w-4" />}
              label="Relayer fees (cross-VM)"
              ethValue={fluentFees.relayerFeeEth}
              usdValue={fluentFees.relayerFeeEth * fluentFees.ethPriceUsd}
              description="Cumulative cross-VM relayer fees from blended execution."
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
          <div className="rounded-lg border border-border bg-muted/30 p-6">
            <p className="text-sm text-muted-foreground">
              Fluent indexer temporarily unreachable. Data refreshes every hour.
            </p>
          </div>
        )}

        <p className="mt-3 font-mono text-2xs uppercase tracking-wider text-muted-foreground/70">
          ETH @ ${fluentFees.ethPriceUsd.toFixed(2)} via CoinGecko · refreshes hourly
        </p>
      </section>

      {/* Peer comparison */}
      <section>
        <div className="mb-5 flex items-center gap-2">
          <span className="font-mono text-2xs uppercase tracking-wider text-muted-foreground">
            Peer cohort · zk-rollups
          </span>
        </div>

        {fluentEntry?.source === "fluent-indexer" && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-accent/30 bg-accent/5 p-4">
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Fluent data from native indexer
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                DefiLlama hasn&apos;t indexed Fluent yet, so revenue is pulled directly from
                Fluent&apos;s public API at api.fluent.xyz. TVL data will populate once
                DefiLlama listing is complete.
              </p>
            </div>
          </div>
        )}

        <div className="mb-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
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

        <div className="overflow-hidden rounded-lg border border-border">
          <div className="grid grid-cols-12 gap-4 border-b border-border bg-muted/40 px-5 py-3 font-mono text-2xs uppercase tracking-wider text-muted-foreground">
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

        {/* Honest footnote about Fluent's revenue window */}
        <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
          <span className="font-mono text-accent">*</span>
          <p className="leading-relaxed">
            Fluent revenue is{" "}
            <span className="text-foreground">cumulative since mainnet launch</span>{" "}
            ({daysLive} days), not a trailing 30-day window. Fluent&apos;s indexer doesn&apos;t
            yet expose time-windowed data, so peer comparison isn&apos;t strictly
            apples-to-apples until that endpoint exists or DefiLlama indexes Fluent.
          </p>
        </div>
      </section>

      <p className="mt-8 font-mono text-2xs uppercase tracking-wider text-muted-foreground/70">
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
        "flex flex-col gap-3 p-6",
        highlight ? "bg-accent/[0.04]" : "bg-background"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-2xs uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className={cn("text-muted-foreground", highlight && "text-accent")}>{icon}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span
          className={cn(
            "tabular text-3xl font-semibold tracking-tight",
            highlight && "text-accent"
          )}
        >
          {formatUsd(usdValue)}
        </span>
        <span className="font-mono text-2xs uppercase tracking-wider text-muted-foreground">
          {formatEth(ethValue)}
        </span>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
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
    <div className="flex flex-col gap-1.5 bg-background p-5">
      <span className="font-mono text-2xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="tabular text-xl font-semibold tracking-tight">{value}</span>
      <span className="text-2xs text-muted-foreground">{sublabel}</span>
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
        "grid grid-cols-12 items-center gap-4 border-b border-border px-5 py-4 last:border-b-0 hover-bright",
        isFluent ? "bg-accent/[0.04] hover:bg-accent/[0.08]" : "hover:bg-muted/30"
      )}
    >
      <div className="col-span-3 flex items-center gap-3">
        {isFluent && <span className="status-dot status-dot-live shrink-0" />}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "text-sm font-semibold tracking-tight",
                isFluent && "text-accent"
              )}
            >
              {chain.displayName}
            </span>
            {isNativeSource && (
              <span
                className="rounded border border-accent/30 bg-accent/10 px-1 py-0.5 font-mono text-2xs uppercase tracking-wider text-accent"
                title="Data sourced from api.fluent.xyz instead of DefiLlama"
              >
                Native
              </span>
            )}
          </div>
          <span className="font-mono text-2xs uppercase tracking-wider text-muted-foreground">
            {chain.slug}
          </span>
        </div>
      </div>
      <div className="col-span-3 text-right">
        <span className="tabular text-sm font-medium">
          {chain.tvl === null ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            formatTvl(chain.tvl)
          )}
        </span>
      </div>
      <div className="col-span-3 text-right">
        <span
          className={cn(
            "tabular text-sm font-medium",
            isNativeSource && "text-accent"
          )}
        >
          {chain.fees30dUsd === null ? (
            <span className="text-muted-foreground font-normal">—</span>
          ) : (
            <>
              {formatFees(chain.fees30dUsd)}
              {chain.feesAreCumulative && (
                <span className="ml-1 text-accent" title="Cumulative since launch — see footnote">
                  *
                </span>
              )}
            </>
          )}
        </span>
      </div>
      <div className="col-span-2 text-right">
        <ChangeBadge change={change7d} />
      </div>
      <div className="col-span-1 text-right">
        <span className="tabular text-sm text-muted-foreground">{chain.protocols ?? "—"}</span>
      </div>
    </div>
  );
}

function ChangeBadge({ change }: { change: { text: string; positive: boolean } }) {
  if (change.text === "—") {
    return (
      <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
        <Minus className="h-3 w-3" />—
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 tabular text-xs font-medium",
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
