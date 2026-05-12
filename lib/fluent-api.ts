/**
 * Fluent indexer API client.
 *
 * Fluent exposes a public indexer at https://api.fluent.xyz/indexer/v1/.
 * Currently known endpoints:
 *   - /fees/total → { l2_fee, relayer_fee, total_fee } (values in ETH, as strings)
 *
 * More endpoints likely exist but aren't publicly documented yet.
 * Add new ones here as we learn about them.
 */

const FLUENT_API_BASE = "https://api.fluent.xyz/indexer/v1";

/**
 * Raw response from /fees/total.
 * All values are decimal-string representations of ETH (not wei).
 */
type FluentFeesRaw = {
  l2_fee: string;
  relayer_fee: string;
  total_fee: string;
};

export type FluentFees = {
  /** Cumulative L2 sequencer fees, in ETH */
  l2FeeEth: number;
  /** Cumulative cross-VM relayer fees, in ETH */
  relayerFeeEth: number;
  /** Sum of L2 + relayer, in ETH */
  totalFeeEth: number;
  /** USD value of total fees, using passed-in ETH price */
  totalFeeUsd: number;
  /** ETH price used for conversion */
  ethPriceUsd: number;
  /** Whether the fetch succeeded */
  ok: boolean;
};

/**
 * Fetches ETH/USD price from CoinGecko (free, no auth).
 * Falls back to a reasonable estimate if the API fails.
 */
async function fetchEthPrice(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      { next: { revalidate: 600 } } // 10 min cache for price
    );
    if (!res.ok) return 2283; // fallback to known-recent price
    const data = await res.json();
    return data?.ethereum?.usd ?? 2283;
  } catch {
    return 2283;
  }
}

export async function getFluentFees(): Promise<FluentFees> {
  const ethPriceUsd = await fetchEthPrice();

  try {
    const res = await fetch(`${FLUENT_API_BASE}/fees/total`, {
      next: { revalidate: 3600 }, // 1 hour cache
    });
    if (!res.ok) {
      return {
        l2FeeEth: 0,
        relayerFeeEth: 0,
        totalFeeEth: 0,
        totalFeeUsd: 0,
        ethPriceUsd,
        ok: false,
      };
    }
    const data: FluentFeesRaw = await res.json();
    const l2FeeEth = parseFloat(data.l2_fee) || 0;
    const relayerFeeEth = parseFloat(data.relayer_fee) || 0;
    const totalFeeEth = parseFloat(data.total_fee) || 0;

    return {
      l2FeeEth,
      relayerFeeEth,
      totalFeeEth,
      totalFeeUsd: totalFeeEth * ethPriceUsd,
      ethPriceUsd,
      ok: true,
    };
  } catch (err) {
    console.error("Fluent indexer fetch failed:", err);
    return {
      l2FeeEth: 0,
      relayerFeeEth: 0,
      totalFeeEth: 0,
      totalFeeUsd: 0,
      ethPriceUsd,
      ok: false,
    };
  }
}

/**
 * Formats an ETH amount with 4 decimal places.
 */
export function formatEth(eth: number): string {
  return `${eth.toFixed(4)} ETH`;
}

/**
 * Formats a USD amount with $ prefix and appropriate precision.
 */
export function formatUsd(usd: number): string {
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(2)}M`;
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(2)}K`;
  return `$${usd.toFixed(2)}`;
}
