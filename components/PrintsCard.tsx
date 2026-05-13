import {
  FAMILY_INFO,
  FAMILY_ORDER,
  TIER_INFO,
  computeOverallScore,
  type PrintsResponse,
  type Tier,
  type FamilyKey,
} from "@/lib/prints";
import { cn } from "@/lib/utils";
import { Shield, FlaskConical, Hammer, Sparkles } from "lucide-react";

const TIER_STYLES: Record<Tier, { badge: string; row: string; label: string }> = {
  A: {
    badge: "bg-accent text-white border-accent",
    row: "border-accent/30 bg-accent/[0.06]",
    label: "text-accent",
  },
  B: {
    badge: "bg-success text-white border-success",
    row: "border-success/25 bg-success/[0.05]",
    label: "text-success",
  },
  C: {
    badge: "bg-warning text-background border-warning",
    row: "border-warning/25 bg-warning/[0.05]",
    label: "text-warning",
  },
  D: {
    badge: "bg-muted text-muted-foreground border-border",
    row: "border-border bg-background",
    label: "text-muted-foreground",
  },
};

const FAMILY_ICON: Record<FamilyKey, React.ReactNode> = {
  identity: <Shield className="h-4 w-4" />,
  tester: <FlaskConical className="h-4 w-4" />,
  builder: <Hammer className="h-4 w-4" />,
  influential: <Sparkles className="h-4 w-4" />,
};

/**
 * Renders a user's Prints with full family names + prominent tier badges.
 *
 * `linkable` - when false, the X handle is rendered as a <span> (used when
 * the entire card is wrapped in a Link, avoiding nested-anchor hydration errors).
 */
export function PrintsCard({
  data,
  isDefault,
  compact = false,
  linkable = true,
}: {
  data: PrintsResponse;
  isDefault: boolean;
  compact?: boolean;
  linkable?: boolean;
}) {
  const overall = computeOverallScore(data.families);
  const handleNode = linkable ? (
    <a
      href={`https://x.com/${data.x_handle}`}
      target="_blank"
      rel="noreferrer"
      className="text-[16px] font-semibold tracking-tight hover:text-accent"
    >
      @{data.x_handle}
    </a>
  ) : (
    <span className="text-[16px] font-semibold tracking-tight">@{data.x_handle}</span>
  );

  return (
    <div className="card flex flex-col gap-5 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          {handleNode}
          {isDefault ? (
            <span className="text-[11px] text-muted-foreground">
              Default tiers · scores still calculating
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground">
              Prints reputation
            </span>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-0.5">
          <span className="num-display text-[22px] font-semibold tracking-tight">
            {overall}
          </span>
          <span className="eyebrow">Overall</span>
        </div>
      </div>

      {/* Family tiers - full width rows, full names, prominent tier badges */}
      <div className="flex flex-col gap-2">
        {FAMILY_ORDER.map((key) => {
          const family = data.families[key];
          const info = FAMILY_INFO[key];
          const styles = TIER_STYLES[family.tier];
          return (
            <div
              key={key}
              className={cn(
                "flex items-center justify-between rounded-lg border p-3 transition-colors",
                styles.row
              )}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span className={cn("shrink-0", styles.label)}>{FAMILY_ICON[key]}</span>
                <div className="flex min-w-0 flex-col">
                  <span className="text-[13px] font-medium leading-tight">
                    {info.label}
                  </span>
                  {!compact && (
                    <span className="text-[11px] leading-tight text-muted-foreground">
                      {info.description}
                    </span>
                  )}
                </div>
              </div>
              <TierBadge tier={family.tier} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TierBadge({ tier, size = "default" }: { tier: Tier; size?: "default" | "lg" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md border font-mono font-bold shadow-sm",
        TIER_STYLES[tier].badge,
        size === "lg"
          ? "h-10 w-10 text-[16px]"
          : "h-8 w-8 text-[13px]"
      )}
      title={`Tier ${tier} — ${TIER_INFO[tier].description}`}
    >
      {tier}
    </span>
  );
}
