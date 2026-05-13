import Link from "next/link";
import { ArrowLeft, ExternalLink, Info } from "lucide-react";
import { getPrints, FAMILY_INFO, FAMILY_ORDER, TIER_INFO } from "@/lib/prints";
import { PrintsCard, TierBadge } from "@/components/PrintsCard";
import { PrintsLookup } from "@/components/PrintsLookup";

export const metadata = {
  title: "Prints — Reputation lookup",
  description:
    "Check anyone's Fluent Prints tiers — identity, tester, builder, influential. Live from api.fluent.xyz.",
};

const FEATURED_HANDLES = [
  "fluentxyz",
  "dino_eth",
  "BlendedBldrs",
  "Asuzu_a",
  "diobiyanu",
  "Ja__so",
  "iamgold81",
];

type SearchParams = { id?: string };

export default async function PrintsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const queryId = params.id?.trim();

  const lookupResult = queryId ? await getPrints(queryId) : null;

  const featuredResults = await Promise.all(
    FEATURED_HANDLES.map(async (handle) => ({
      handle,
      result: await getPrints(handle),
    }))
  );

  return (
    <div className="container-wide py-20">
      <Link
        href="/"
        className="mb-10 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to home
      </Link>

      <div className="reveal flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="eyebrow eyebrow-accent">Prints</span>
          <span className="rounded border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-success">
            Live
          </span>
        </div>
        <h1 className="text-[44px] font-semibold leading-[1.05] tracking-tight sm:text-[56px]">
          Check anyone&apos;s Prints.
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Fluent Prints is a multi-context reputation system. Paste an X handle, wallet
          address, or Privy DID — see their tier across identity, tester, builder, and
          influential signals. Live from{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px]">
            fluent-connect.api.fluent.xyz
          </code>
          .
        </p>
      </div>

      {/* Lookup form */}
      <section className="reveal mt-12" style={{ animationDelay: "100ms" }}>
        <PrintsLookup initialValue={queryId ?? ""} />
        <p className="mt-3 text-[12px] text-muted-foreground">
          Accepts X handles (e.g.{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">@blendino</code>
          ), wallet addresses (
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">0x...</code>
          ), or Privy DIDs.
        </p>
      </section>

      {/* Tier scale legend - now near the top for context */}
      <section
        className="reveal mt-12 rounded-xl border border-border bg-background-elevated p-6"
        style={{ animationDelay: "150ms" }}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <span className="eyebrow eyebrow-accent">Tier scale</span>
            <p className="mt-2 text-[13px] text-muted-foreground">
              A is highest, D is the default. Each family is scored independently.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(["A", "B", "C", "D"] as const).map((tier) => (
            <div key={tier} className="flex items-center gap-3">
              <TierBadge tier={tier} size="lg" />
              <div className="flex flex-col">
                <span className="text-[13px] font-medium">Tier {tier}</span>
                <span className="text-[11px] text-muted-foreground">
                  {TIER_INFO[tier].description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lookup result */}
      {queryId && lookupResult && (
        <section className="reveal mt-12" style={{ animationDelay: "200ms" }}>
          <div className="mb-6 flex items-center gap-2">
            <span className="eyebrow eyebrow-accent">Result for {queryId}</span>
          </div>
          {lookupResult.ok ? (
            <PrintsCard data={lookupResult.data} isDefault={lookupResult.isDefault} />
          ) : (
            <div className="rounded-xl border border-warning/30 bg-warning/5 p-6">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <div>
                  <p className="text-[14px] font-medium">Lookup failed</p>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    {lookupResult.error}
                  </p>
                  <p className="mt-3 text-[12px] text-muted-foreground">
                    Make sure the identifier is correct. The user must have signed up for{" "}
                    <a
                      href="https://connect.fluent.xyz"
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent hover:underline"
                    >
                      Fluent Connect
                    </a>{" "}
                    for live data.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Featured profiles */}
      <section className="reveal mt-20" style={{ animationDelay: "300ms" }}>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="eyebrow eyebrow-accent">Featured</span>
            <h2 className="text-[28px] font-semibold tracking-tight">
              Profiles to explore
            </h2>
            <p className="text-[14px] text-muted-foreground">
              A hand-picked showcase. Click any to see their full Prints.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredResults.map(({ handle, result }, i) => (
            <Link
              key={handle}
              href={`/prints?id=${handle}`}
              className="reveal block"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {result.ok ? (
                <PrintsCard
                  data={result.data}
                  isDefault={result.isDefault}
                  compact
                  linkable={false}
                />
              ) : (
                <div className="card flex h-full flex-col gap-3 p-6">
                  <span className="text-[16px] font-semibold tracking-tight">
                    @{handle}
                  </span>
                  <p className="text-[12px] text-muted-foreground">
                    Not yet registered with Prints
                  </p>
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="reveal mt-20" style={{ animationDelay: "400ms" }}>
        <div className="mb-8 flex flex-col gap-2">
          <span className="eyebrow eyebrow-accent">How it works</span>
          <h2 className="text-[28px] font-semibold tracking-tight">
            Four families, four signals.
          </h2>
          <p className="text-[14px] text-muted-foreground">
            Prints isn&apos;t a single score. Each family represents a different kind of
            reputation, scored independently.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
          {FAMILY_ORDER.map((key) => {
            const info = FAMILY_INFO[key];
            return (
              <div key={key} className="flex flex-col gap-2 bg-background p-6">
                <span className="text-[14px] font-semibold">{info.label}</span>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  {info.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-16 flex items-start gap-3 rounded-xl border border-border bg-background-elevated p-6">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <div className="flex flex-col gap-2">
          <p className="text-[14px] font-medium">About this data</p>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Prints data is sourced live from{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[12px]">
              fluent-connect.api.fluent.xyz
            </code>
            . Sign up at{" "}
            <a
              href="https://connect.fluent.xyz"
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:underline"
            >
              connect.fluent.xyz
              <ExternalLink className="ml-1 inline h-3 w-3" />
            </a>{" "}
            to build your own Print. True ranked leaderboards (e.g. &quot;top 100 by
            builder tier&quot;) require a bulk endpoint that isn&apos;t yet public —
            we&apos;ll integrate it the moment Fluent ships one.
          </p>
        </div>
      </div>

      <p className="mt-12 text-[11px] uppercase tracking-wider text-muted-foreground/70">
        Source: fluent-connect.api.fluent.xyz · cached 5min per identifier
      </p>
    </div>
  );
}
