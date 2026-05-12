import type { Category, Status } from "./schema";

export const CATEGORY_LABELS: Record<Category, string> = {
  defi: "DeFi",
  social: "Social",
  gaming: "Gaming",
  infrastructure: "Infrastructure",
  identity: "Identity",
  prediction: "Prediction",
  stablecoin: "Stablecoin",
  tools: "Tools",
};

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  defi: "Lending, borrowing, swapping, and yield protocols.",
  social: "Social apps, communities, and reputation-based experiences.",
  gaming: "On-chain games, fantasy leagues, and play-to-earn.",
  infrastructure: "Tooling, indexers, oracles, and developer infra.",
  identity: "Reputation, credentials, and on-chain identity primitives.",
  prediction: "Prediction markets, polling, and forecasting protocols.",
  stablecoin: "Stablecoins and yield-bearing dollar instruments.",
  tools: "Wallets, explorers, and utilities for the Fluent ecosystem.",
};

export const STATUS_LABELS: Record<Status, string> = {
  live: "Live on Mainnet",
  testnet: "On Testnet",
  "coming-soon": "Coming Soon",
  deprecated: "Deprecated",
};

export const STATUS_STYLES: Record<Status, string> = {
  live: "bg-green-500/10 text-green-400 border-green-500/30",
  testnet: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  "coming-soon": "bg-blue-500/10 text-blue-400 border-blue-500/30",
  deprecated: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
};
