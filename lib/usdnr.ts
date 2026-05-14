/**
 * USDnr metrics.
 *
 * USDnr is Fluent's native stablecoin, issued by Nerona on M0 infrastructure
 * and backed by US Treasury Bills. T-bill yield accrues to the protocol.
 *
 * Data source: M0 dashboard (dashboard.m0.org/stablecoins/usdnr).
 *
 * Currently manually verified — we mirror blendiction.xyz/revenue's methodology
 * here. The M0 Protocol API exists but requires an API key (request at
 * m0.org/contact-us). Once granted, this module will be replaced with a live
 * fetch. Medium-term plan: read USDnr total supply on-chain from Fluentscan
 * and compute accrued yield directly via T-bill APY × supply × time.
 *
 * Update procedure: re-read the M0 dashboard, update the constants below,
 * commit with a note like "Update USDnr from M0 dashboard, observed YYYY-MM-DD".
 */

export type UsdnrMetrics = {
  /** Cumulative T-bill yield accrued to the protocol, in USD */
  accruedRewardsUsd: number;
  /** Circulating supply of USDnr tokens */
  circulatingSupply: number;
  /** US Treasury Bills backing collateral, in USD */
  collateralUsd: number;
  /** Number of distinct USDnr holders */
  holders: number;
  /** ISO date when these numbers were observed from M0 dashboard */
  observedOn: string;
  /** URL to source dashboard */
  sourceUrl: string;
};

/**
 * USDnr metrics as of last manual observation from M0 dashboard.
 * Read live numbers from dashboard.m0.org/stablecoins/usdnr and update here.
 */
export const USDNR_METRICS: UsdnrMetrics = {
  accruedRewardsUsd: 110_657,
  circulatingSupply: 10_227_044,
  collateralUsd: 10_278_436,
  holders: 230,
  observedOn: "2026-05-14",
  sourceUrl: "https://dashboard.m0.org/stablecoins/usdnr",
};

/**
 * Formats large numbers for display.
 * 110657 → "$110.66K"
 * 10227044 → "10.23M"
 */
export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
  return n.toString();
}

export function formatCountUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(2)}K`;
  return `$${n.toFixed(0)}`;
}
