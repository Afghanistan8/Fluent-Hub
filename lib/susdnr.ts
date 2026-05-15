/**
 * sUSDnr on Fluent — on-chain reader.
 *
 * sUSDnr (Staked USDnr) is the yield-bearing wrapper of USDnr that lives
 * on Fluent. It's deployed at 0xfa9b3b45587f9fcde14759121c3868c2733dcbf4
 * and the yield comes from Upshift DeFi strategies.
 *
 * Data sourced from Fluentscan (Blockscout): https://fluentscan.xyz
 *
 * IMPORTANT: This is NOT the same metric as M0's USDnr accrued rewards.
 * USDnr itself lives on Ethereum mainnet — the M0 dashboard tracks T-bill
 * yield across the entire M0 ecosystem. This module reads ONLY the Fluent
 * portion: how much sUSDnr is staked on Fluent, and how many holders.
 *
 * Source: https://app.nerona.xyz/transparency (which lists the contract
 * address and links it to fluentscan.xyz).
 */

export const SUSDNR_CONTRACT = "0xfa9b3b45587f9fcde14759121c3868c2733dcbf4";

// Fluentscan is Blockscout-based. Standard REST API pattern.
const BLOCKSCOUT_API = "https://fluentscan.xyz/api/v2";

export type SUsdnrMetrics =
  | {
      ok: true;
      totalSupply: number;
      holders: number | null;
      symbol: string;
      decimals: number;
      contractAddress: string;
    }
  | { ok: false; error: string };

type BlockscoutTokenResponse = {
  address?: string;
  name?: string;
  symbol?: string;
  decimals?: string;
  total_supply?: string;
  holders?: string;
  holders_count?: string;
  type?: string;
};

/**
 * Fetches sUSDnr metrics from Fluentscan.
 *
 * Returns ok:false with a friendly error if anything fails — never throws.
 * Network page handles the error case gracefully so a Fluentscan outage
 * doesn't break the entire page.
 */
export async function getSusdnrMetrics(): Promise<SUsdnrMetrics> {
  try {
    const url = `${BLOCKSCOUT_API}/tokens/${SUSDNR_CONTRACT}`;
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // hourly
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return {
        ok: false,
        error: `Fluentscan returned ${res.status}`,
      };
    }

    const data = (await res.json()) as BlockscoutTokenResponse;

    if (!data.total_supply || !data.decimals) {
      return {
        ok: false,
        error: "Fluentscan response missing required fields",
      };
    }

    const decimals = parseInt(data.decimals, 10);
    const rawSupply = BigInt(data.total_supply);
    // Convert from raw token units (wei-like) to whole tokens
    const totalSupply = Number(rawSupply) / Math.pow(10, decimals);

    // Blockscout uses different field names in different versions
    const holdersStr = data.holders_count ?? data.holders;
    const holders = holdersStr ? parseInt(holdersStr, 10) : null;

    return {
      ok: true,
      totalSupply,
      holders,
      symbol: data.symbol ?? "sUSDnr",
      decimals,
      contractAddress: SUSDNR_CONTRACT,
    };
  } catch (err) {
    console.error("Fluentscan fetch failed:", err);
    return {
      ok: false,
      error: "Couldn't reach Fluentscan. Network or API issue.",
    };
  }
}

export function formatTokenSupply(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
  if (n >= 1) return n.toFixed(2);
  return n.toFixed(4);
}
