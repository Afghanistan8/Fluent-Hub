/**
 * DefiLlama chain data fetcher + Fluent native data merger.
 *
 * For peers: pulls TVL + 30d fees from DefiLlama (real apples-to-apples window).
 * For Fluent: uses cumulative fees from api.fluent.xyz because the indexer
 * doesn't expose time-windowed data. We flag this explicitly in the UI
 * so the comparison isn't misleading.
 */

import { getFluentFees } from "./fluent-api";

const DEFILLAMA_BASE = "https://api.llama.fi";

// Fluent mainnet launched on this date — used to caption the
// "Fluent: cumulative since mainnet launch" footnote.
const FLUENT_MAINNET_LAUNCH = "2026-04-24";

export type ChainMetrics = {
  slug: string;
  displayName: string;
  tvl: number | null;
  change_1d: number | null;
  change_7d: number | null;
  protocols: number | null;
  /** Fees in USD over the trailing 30-day window (for peers) or cumulative since launch (for Fluent) */
  fees30dUsd: number | null;
  /** True if this number represents cumulative-since-launch, not a real 30d window */
  feesAreCumulative: boolean;
  indexed: boolean;
  source: "defillama" | "fluent-indexer" | "missing";
};

export const COHORT: { slug: string; displayName: string }[] = [
  { slug: "fluent", displayName: "Fluent" },
  { slug: "zksync-era", displayName: "zkSync Era" },
  { slug: "scroll", displayName: "Scroll" },
  { slug: "linea", displayName: "Linea" },
  { slug: "polygon-zkevm", displayName: "Polygon zkEVM" },
  { slug: "starknet", displayName: "Starknet" },
];

type DefiLlamaChain = {
  gecko_id: string | null;
  tvl: number;
  tokenSymbol: string | null;
  cmcId: string | null;
  name: string;
  chainId: number | null;
  change_1d?: number;
  change_7d?: number;
  protocols?: number;
};

type DefiLlamaFeesOverview = {
  total24h?: number;
  total7d?: number;
  total30d?: number;
  totalAllTime?: number;
};

async function fetchAllChains(): Promise<Map<string, DefiLlamaChain>> {
  try {
    const res = await fetch(`${DEFILLAMA_BASE}/v2/chains`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return new Map();
    const chains: DefiLlamaChain[] = await res.json();
    const map = new Map<string, DefiLlamaChain>();
    for (const c of chains) {
      const key = c.name.toLowerCase().replace(/\s+/g, "-");
      map.set(key, c);
      map.set(c.name.toLowerCase(), c);
    }
    return map;
  } catch (err) {
    console.error("DefiLlama chains fetch failed:", err);
    return new Map();
  }
}

/**
 * Fetches 30-day fees for a chain from DefiLlama.
 * Falls back to total7d × ~4.3 if 30d isn't available (rough estimate, last resort).
 */
async function fetchChain30dFees(chainDisplayName: string): Promise<number | null> {
  try {
    const encoded = encodeURIComponent(chainDisplayName);
    const res = await fetch(
      `${DEFILLAMA_BASE}/overview/fees/${encoded}?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data: DefiLlamaFeesOverview = await res.json();
    if (data.total30d !== undefined && data.total30d !== null) return data.total30d;
    if (data.total7d !== undefined && data.total7d !== null) return data.total7d * (30 / 7);
    return null;
  } catch {
    return null;
  }
}

export async function getCohortMetrics(): Promise<ChainMetrics[]> {
  const [chainMap, fluentNative] = await Promise.all([fetchAllChains(), getFluentFees()]);

  const peerFeesPromises = COHORT.filter((c) => c.slug !== "fluent").map(async (c) => {
    const fees = await fetchChain30dFees(c.displayName);
    return [c.slug, fees] as const;
  });
  const peerFeesResults = await Promise.all(peerFeesPromises);
  const peerFeesMap = new Map(peerFeesResults);

  return COHORT.map(({ slug, displayName }) => {
    if (slug === "fluent") {
      const dataFromLlama = chainMap.get(slug);
      if (dataFromLlama) {
        return {
          slug,
          displayName,
          tvl: dataFromLlama.tvl ?? null,
          change_1d: dataFromLlama.change_1d ?? null,
          change_7d: dataFromLlama.change_7d ?? null,
          protocols: dataFromLlama.protocols ?? null,
          fees30dUsd: fluentNative.ok ? fluentNative.totalFeeUsd : null,
          feesAreCumulative: true, // We don't have time-windowed fluent data yet
          indexed: true,
          source: "defillama",
        };
      }
      if (fluentNative.ok) {
        return {
          slug,
          displayName,
          tvl: null,
          change_1d: null,
          change_7d: null,
          protocols: null,
          fees30dUsd: fluentNative.totalFeeUsd,
          feesAreCumulative: true,
          indexed: false,
          source: "fluent-indexer",
        };
      }
      return {
        slug,
        displayName,
        tvl: null,
        change_1d: null,
        change_7d: null,
        protocols: null,
        fees30dUsd: null,
        feesAreCumulative: false,
        indexed: false,
        source: "missing",
      };
    }

    const data = chainMap.get(slug);
    if (!data) {
      return {
        slug,
        displayName,
        tvl: null,
        change_1d: null,
        change_7d: null,
        protocols: null,
        fees30dUsd: null,
        feesAreCumulative: false,
        indexed: false,
        source: "missing",
      };
    }
    return {
      slug,
      displayName,
      tvl: data.tvl ?? null,
      change_1d: data.change_1d ?? null,
      change_7d: data.change_7d ?? null,
      protocols: data.protocols ?? null,
      fees30dUsd: peerFeesMap.get(slug) ?? null,
      feesAreCumulative: false,
      indexed: true,
      source: "defillama",
    };
  });
}

export function formatTvl(tvl: number | null): string {
  if (tvl === null) return "—";
  if (tvl >= 1_000_000_000) return `$${(tvl / 1_000_000_000).toFixed(2)}B`;
  if (tvl >= 1_000_000) return `$${(tvl / 1_000_000).toFixed(1)}M`;
  if (tvl >= 1_000) return `$${(tvl / 1_000).toFixed(1)}K`;
  return `$${tvl.toFixed(0)}`;
}

export function formatFees(fees: number | null): string {
  if (fees === null) return "—";
  if (fees >= 1_000_000_000) return `$${(fees / 1_000_000_000).toFixed(2)}B`;
  if (fees >= 1_000_000) return `$${(fees / 1_000_000).toFixed(1)}M`;
  if (fees >= 1_000) return `$${(fees / 1_000).toFixed(1)}K`;
  return `$${fees.toFixed(2)}`;
}

export function formatChange(change: number | null): {
  text: string;
  positive: boolean;
} {
  if (change === null) return { text: "—", positive: false };
  const positive = change >= 0;
  return {
    text: `${positive ? "+" : ""}${change.toFixed(2)}%`,
    positive,
  };
}

export { FLUENT_MAINNET_LAUNCH };
