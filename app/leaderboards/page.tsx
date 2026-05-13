import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Trophy,
  Brain,
  Users,
  Sparkles,
  Lock,
  CheckCircle2,
  Clock,
} from "lucide-react";

export const metadata = {
  title: "Reputation Leaderboards",
  description:
    "Multi-context Prints leaderboards for the Fluent ecosystem — pending public API access.",
};

export default function LeaderboardsPage() {
  return (
    <div className="container-narrow py-14">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to home
      </Link>

      {/* Header */}
      <div className="reveal flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-2xs uppercase tracking-wider text-accent">
            Leaderboards
          </span>
          <span className="rounded border border-warning/30 bg-warning/5 px-1.5 py-0.5 font-mono text-2xs uppercase tracking-wider text-warning">
            Waiting on Prints API
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Reputation, ranked across contexts.
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          A multi-context view of Prints standings on Fluent — DeFi reputation, predictor
          accuracy, per-project fandom, and overall score. Built to ship the moment Prints
          exposes a public contract or API endpoint.
        </p>
      </div>

      {/* Why it's empty — the honesty section */}
      <section className="reveal mt-12 rounded-lg border border-border bg-muted/20 p-6" style={{ animationDelay: "100ms" }}>
        <div className="flex items-start gap-3">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-semibold tracking-tight">Why this page is empty</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Prints is Fluent&apos;s reputation primitive, but the scoring contract or
              indexer endpoint isn&apos;t publicly documented yet. Until that ships,
              populating these leaderboards would mean fabricating data — which defeats the
              purpose of a reputation system.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Fluent Hub will integrate Prints the moment a public read path exists. No
              placeholder rankings. No fake scores. This page populates when the data does.
            </p>
            <div className="mt-1 flex flex-wrap gap-2">
              <a
                href="https://discord.com/invite/fluentxyz"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border-strong bg-muted px-3 py-1.5 text-xs font-medium hover-bright hover:bg-background-elevated"
              >
                Track on Fluent Discord
                <ArrowUpRight className="h-3 w-3" />
              </a>
              <a
                href="https://github.com/Afghanistan8/fluent-hub"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border-strong bg-muted px-3 py-1.5 text-xs font-medium hover-bright hover:bg-background-elevated"
              >
                Watch repo for updates
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* The four leaderboards we'll ship */}
      <section className="reveal mt-12" style={{ animationDelay: "200ms" }}>
        <div className="mb-6 flex flex-col gap-2">
          <span className="font-mono text-2xs uppercase tracking-wider text-accent">
            The plan
          </span>
          <h2 className="text-xl font-semibold tracking-tight">Four leaderboards, four contexts</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Reputation isn&apos;t a single score. A wallet can be a top-tier DeFi user, a
            mid-tier predictor, and a high-affinity fan of one project — all at once. Each
            context surfaces what matters to it.
          </p>
        </div>

        <div className="data-grid sm:grid-cols-2">
          <PlannedBoard
            number="01"
            icon={<Trophy className="h-4 w-4" />}
            title="Overall Prints Score"
            description="Aggregate reputation across every Fluent dApp. Combines on-chain behavior, social signals, and predictor accuracy into one ranking."
            inputs={["On-chain activity", "Ethos score", "Kaito smart followers", "Predictor history"]}
          />
          <PlannedBoard
            number="02"
            icon={<Brain className="h-4 w-4" />}
            title="Top Predictors"
            description="Wallets with the highest forecasting accuracy across Pulse Predictor and other prediction markets on Fluent."
            inputs={["Resolved market accuracy", "Prediction volume", "Time-weighted skill score"]}
          />
          <PlannedBoard
            number="03"
            icon={<Sparkles className="h-4 w-4" />}
            title="DeFi Reputation"
            description="Most reputable users across Fluent DeFi — Vena, Yumi, Blend, Sprout. Repayment history, liquidation rate, capital efficiency."
            inputs={["Repayment ratio", "Avg health factor", "Cross-protocol consistency"]}
          />
          <PlannedBoard
            number="04"
            icon={<Users className="h-4 w-4" />}
            title="Per-Project Fans"
            description="Top contributors and most engaged users per Fluent dApp. Each project gets its own ranking based on activity within that ecosystem."
            inputs={["Project-specific tx count", "Holding duration", "Community participation"]}
          />
        </div>
      </section>

      {/* Architecture readiness */}
      <section className="reveal mt-16" style={{ animationDelay: "300ms" }}>
        <div className="mb-6 flex flex-col gap-2">
          <span className="font-mono text-2xs uppercase tracking-wider text-accent">
            Status
          </span>
          <h2 className="text-xl font-semibold tracking-tight">What&apos;s ready, what&apos;s waiting</h2>
        </div>

        <div className="flex flex-col gap-px overflow-hidden rounded-lg border border-border bg-border">
          <StatusItem
            status="done"
            label="Frontend architecture"
            detail="React table components, sortable columns, wallet lookup pages — all designed and ready to consume real data."
          />
          <StatusItem
            status="done"
            label="Data fetching layer"
            detail="Cached server-side fetch pattern proven on the Network page (api.fluent.xyz + DefiLlama). Same pattern will read Prints."
          />
          <StatusItem
            status="done"
            label="Multi-context schema"
            detail="Type definitions for four leaderboard contexts. New leaderboards plug in via config, not custom code."
          />
          <StatusItem
            status="waiting"
            label="Prints contract address or read API"
            detail="Currently undocumented. Awaiting official confirmation from Fluent Labs."
          />
          <StatusItem
            status="waiting"
            label="Wallet lookup endpoint"
            detail="Per-wallet score retrieval for the wallet detail page."
          />
        </div>
      </section>

      {/* Footnote */}
      <p className="mt-12 font-mono text-2xs uppercase tracking-wider text-muted-foreground/70">
        Empty by design · Real data only · Last reviewed: {new Date().toISOString().split("T")[0]}
      </p>
    </div>
  );
}

function PlannedBoard({
  number,
  icon,
  title,
  description,
  inputs,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  inputs: string[];
}) {
  return (
    <div className="flex flex-col gap-3 bg-background p-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-2xs uppercase tracking-wider text-muted-foreground">
          {number}
        </span>
        <span className="flex items-center gap-1.5 font-mono text-2xs uppercase tracking-wider text-muted-foreground">
          <Clock className="h-3 w-3" />
          Pending
        </span>
      </div>
      <span className="text-accent">{icon}</span>
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-1 flex flex-col gap-1.5">
        <span className="font-mono text-2xs uppercase tracking-wider text-muted-foreground/70">
          Will rank by
        </span>
        <ul className="flex flex-col gap-1">
          {inputs.map((input) => (
            <li
              key={input}
              className="flex items-center gap-2 font-mono text-2xs text-muted-foreground"
            >
              <span className="h-1 w-1 rounded-full bg-accent/50" />
              {input}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatusItem({
  status,
  label,
  detail,
}: {
  status: "done" | "waiting";
  label: string;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-4 bg-background p-5">
      {status === "done" ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
      ) : (
        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
      )}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{label}</span>
          <span
            className={
              status === "done"
                ? "font-mono text-2xs uppercase tracking-wider text-success"
                : "font-mono text-2xs uppercase tracking-wider text-warning"
            }
          >
            {status === "done" ? "Ready" : "Waiting"}
          </span>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}
