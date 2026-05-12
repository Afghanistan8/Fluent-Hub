import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Reputation Leaderboards",
  description: "Prints standings across the Fluent ecosystem.",
};

export default function LeaderboardsPage() {
  return (
    <div className="container-narrow py-20">
      <div className="reveal flex flex-col gap-3">
        <span className="font-mono text-2xs uppercase tracking-wider text-accent">Phase 2 · Shipping soon</span>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Reputation Leaderboards</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Multi-context Prints leaderboards. Top wallets by DeFi activity, predictor accuracy,
          social reputation, and per-project fandom. Wallet lookup to see your standing across
          the entire ecosystem.
        </p>
      </div>

      <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
        <Placeholder
          eyebrow="Global"
          title="Overall Prints score"
          description="Aggregated reputation across every Fluent dApp."
        />
        <Placeholder
          eyebrow="DeFi"
          title="Top DeFi reputation"
          description="Wallets with the highest lending and yield reputation."
        />
        <Placeholder
          eyebrow="Prediction"
          title="Top predictors"
          description="Accuracy leaderboard from Pulse Predictor and peers."
        />
        <Placeholder
          eyebrow="Per-project"
          title="Top fans"
          description="Highest-affinity wallets for each Fluent project."
        />
      </div>

      <Link
        href="/"
        className="mt-12 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to home
      </Link>
    </div>
  );
}

function Placeholder({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2 bg-background p-6">
      <span className="font-mono text-2xs uppercase tracking-wider text-muted-foreground">
        {eyebrow}
      </span>
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-3 h-px w-8 bg-border-strong" />
      <span className="font-mono text-2xs uppercase tracking-wider text-accent">Coming soon</span>
    </div>
  );
}
