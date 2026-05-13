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
  title: "Leaderboards",
  description: "Multi-context Prints leaderboards for the Fluent ecosystem.",
};

export default function LeaderboardsPage() {
  return (
    <div className="container-narrow py-20">
      <Link
        href="/"
        className="mb-10 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to home
      </Link>

      <div className="reveal flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="eyebrow eyebrow-accent">Leaderboards</span>
          <span className="rounded border border-warning/30 bg-warning/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-warning">
            Awaiting Prints API
          </span>
        </div>
        <h1 className="text-[44px] font-semibold leading-[1.05] tracking-tight sm:text-[56px]">
          Reputation, ranked.
        </h1>
        <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          A multi-context view of Prints standings on Fluent. Built to ship the moment
          Prints exposes a public contract or read API.
        </p>
      </div>

      <section
        className="reveal mt-14 rounded-xl border border-border bg-background-elevated p-7"
        style={{ animationDelay: "100ms" }}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
            <Lock className="h-4 w-4 text-warning" />
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-[17px] font-semibold tracking-tight">Why this page is empty</h2>
            <p className="text-[14px] leading-relaxed text-muted-foreground">
              Prints is Fluent&apos;s reputation primitive, but the scoring contract or indexer
              endpoint isn&apos;t publicly documented yet. Populating these leaderboards now
              would mean fabricating data — which defeats the purpose of a reputation system.
            </p>
            <p className="text-[14px] leading-relaxed text-muted-foreground">
              Fluent Hub integrates Prints the moment a public read path exists. No placeholder
              rankings. No fake scores. This page populates when the data does.
            </p>
            <div className="mt-1 flex flex-wrap gap-2">
              <a
                href="https://discord.com/invite/fluentxyz"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium hover-bright"
              >
                Track on Discord
                <ArrowUpRight className="h-3 w-3" />
              </a>
              <a
                href="https://github.com/Afghanistan8/fluent-hub"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium hover-bright"
              >
                Watch repo
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="reveal mt-20" style={{ animationDelay: "200ms" }}>
        <div className="mb-8 flex flex-col gap-2">
          <span className="eyebrow eyebrow-accent">The plan</span>
          <h2 className="text-[28px] font-semibold tracking-tight">Four contexts, one view.</h2>
          <p className="text-[14px] text-muted-foreground">
            Reputation isn&apos;t a single score. Each context surfaces what matters to it.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
          <PlannedBoard
            number="01"
            icon={<Trophy className="h-4 w-4" />}
            title="Overall Prints Score"
            description="Aggregate reputation across every Fluent dApp. Combines on-chain behavior, social signals, and predictor accuracy."
            inputs={[
              "On-chain activity",
              "Ethos score",
              "Kaito smart followers",
              "Predictor history",
            ]}
          />
          <PlannedBoard
            number="02"
            icon={<Brain className="h-4 w-4" />}
            title="Top Predictors"
            description="Wallets with the highest forecasting accuracy across Pulse Predictor and other prediction markets."
            inputs={[
              "Resolved market accuracy",
              "Prediction volume",
              "Time-weighted skill score",
            ]}
          />
          <PlannedBoard
            number="03"
            icon={<Sparkles className="h-4 w-4" />}
            title="DeFi Reputation"
            description="Most reputable users across Fluent DeFi. Repayment history, liquidation rate, capital efficiency."
            inputs={["Repayment ratio", "Avg health factor", "Cross-protocol consistency"]}
          />
          <PlannedBoard
            number="04"
            icon={<Users className="h-4 w-4" />}
            title="Per-Project Fans"
            description="Top contributors and most engaged users per Fluent dApp. Each project gets its own ranking."
            inputs={[
              "Project-specific tx count",
              "Holding duration",
              "Community participation",
            ]}
          />
        </div>
      </section>

      <section className="reveal mt-20" style={{ animationDelay: "300ms" }}>
        <div className="mb-8 flex flex-col gap-2">
          <span className="eyebrow eyebrow-accent">Status</span>
          <h2 className="text-[28px] font-semibold tracking-tight">Ready, and waiting.</h2>
        </div>

        <div className="flex flex-col gap-px overflow-hidden rounded-xl border border-border bg-border">
          <StatusItem
            status="done"
            label="Frontend architecture"
            detail="React table components, sortable columns, wallet lookup pages — designed and ready."
          />
          <StatusItem
            status="done"
            label="Data fetching layer"
            detail="Cached server-side fetch pattern proven on the Network page. Same pattern will read Prints."
          />
          <StatusItem
            status="done"
            label="Multi-context schema"
            detail="Type definitions for four leaderboard contexts. New leaderboards plug in via config."
          />
          <StatusItem
            status="waiting"
            label="Prints contract or read API"
            detail="Currently undocumented. Awaiting confirmation from Fluent Labs."
          />
          <StatusItem
            status="waiting"
            label="Wallet lookup endpoint"
            detail="Per-wallet score retrieval for the wallet detail page."
          />
        </div>
      </section>

      <p className="mt-16 text-[11px] uppercase tracking-wider text-muted-foreground/70">
        Empty by design · Real data only · Last reviewed:{" "}
        {new Date().toISOString().split("T")[0]}
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
    <div className="flex flex-col gap-4 bg-background p-7">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[12px] tabular text-muted-foreground">{number}</span>
        <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <Clock className="h-3 w-3" />
          Pending
        </span>
      </div>
      <span className="text-accent">{icon}</span>
      <h3 className="text-[17px] font-semibold tracking-tight">{title}</h3>
      <p className="text-[13px] leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-2 flex flex-col gap-2">
        <span className="eyebrow">Will rank by</span>
        <ul className="flex flex-col gap-1.5">
          {inputs.map((input) => (
            <li
              key={input}
              className="flex items-center gap-2 text-[12px] text-muted-foreground"
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
    <div className="flex items-start gap-4 bg-background p-6">
      {status === "done" ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
      ) : (
        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
      )}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold">{label}</span>
          <span
            className={
              status === "done"
                ? "text-[10px] font-medium uppercase tracking-wider text-success"
                : "text-[10px] font-medium uppercase tracking-wider text-warning"
            }
          >
            {status === "done" ? "Ready" : "Waiting"}
          </span>
        </div>
        <p className="text-[12px] leading-relaxed text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}
