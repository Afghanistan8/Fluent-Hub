import { cn } from "@/lib/utils";

type StatusRow = {
  label: string;
  value: string;
  highlight?: boolean;
  live?: boolean;
};

/**
 * Rialo-inspired system status panel.
 * Sits in the hero, shows live ecosystem state at a glance.
 */
export function SystemStatus({ rows }: { rows: StatusRow[] }) {
  return (
    <div className="status-panel rounded-lg border border-border bg-muted/30 backdrop-blur-sm">
      <div className="border-b border-border px-5 py-3">
        <span className="font-mono text-2xs uppercase tracking-wider text-muted-foreground">
          // System Status
        </span>
      </div>
      <div className="divide-y divide-border">
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 px-5 py-3"
          >
            <span className="text-xs text-muted-foreground">{row.label}</span>
            <span
              className={cn(
                "flex items-center gap-1.5 font-mono text-xs tabular",
                row.highlight ? "text-accent font-medium" : "text-foreground"
              )}
            >
              {row.live && <span className="status-dot status-dot-live" />}
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
