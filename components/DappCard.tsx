import Link from "next/link";
import Image from "next/image";
import type { LoadedDapp } from "@/lib/schema";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/lib/labels";
import { cn } from "@/lib/utils";

const STATUS_DOT_CLASS: Record<LoadedDapp["status"], string> = {
  live: "status-dot-live",
  testnet: "status-dot-testnet",
  "coming-soon": "status-dot-coming-soon",
  deprecated: "status-dot-deprecated",
};

export function DappCard({ dapp }: { dapp: LoadedDapp }) {
  return (
    <Link
      href={`/dapps/${dapp.slug}`}
      className="group relative flex h-full flex-col gap-4 p-5 hover-bright hover:bg-muted/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border border-border bg-background-elevated">
            <Image
              src={dapp.logo}
              alt={`${dapp.name} logo`}
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-[14px] font-semibold tracking-tight">{dapp.name}</h3>
            <p className="font-mono text-2xs uppercase tracking-wider text-muted-foreground">
              {CATEGORY_LABELS[dapp.category]}
            </p>
          </div>
        </div>
        <span
          className="flex items-center gap-1.5 font-mono text-2xs uppercase tracking-wider text-muted-foreground"
          title={STATUS_LABELS[dapp.status]}
        >
          <span className={cn("status-dot", STATUS_DOT_CLASS[dapp.status])} />
          <span className="hidden sm:inline">
            {dapp.status === "live" ? "Live" : dapp.status === "testnet" ? "Test" : dapp.status === "coming-soon" ? "Soon" : "—"}
          </span>
        </span>
      </div>
      <p className="text-[13px] leading-relaxed text-muted-foreground line-clamp-3">
        {dapp.tagline}
      </p>
      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="font-mono text-2xs uppercase tracking-wider text-muted-foreground/70">
          {dapp.slug}
        </span>
        <span className="text-2xs text-muted-foreground/70 transition-colors group-hover:text-foreground">
          View →
        </span>
      </div>
    </Link>
  );
}
