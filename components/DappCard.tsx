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
      className="card group flex h-full flex-col gap-5 p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-background">
            <Image
              src={dapp.logo}
              alt={`${dapp.name} logo`}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold tracking-tight">
              {dapp.name}
            </h3>
            <p className="text-[12px] text-muted-foreground">
              {CATEGORY_LABELS[dapp.category]}
            </p>
          </div>
        </div>
        <span
          className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
          title={STATUS_LABELS[dapp.status]}
        >
          <span className={cn("status-dot", STATUS_DOT_CLASS[dapp.status])} />
          {dapp.status === "live"
            ? "Live"
            : dapp.status === "testnet"
            ? "Test"
            : dapp.status === "coming-soon"
            ? "Soon"
            : "—"}
        </span>
      </div>
      <p className="flex-1 text-[14px] leading-relaxed text-muted-foreground line-clamp-3">
        {dapp.tagline}
      </p>
      <div className="flex items-center gap-1.5 text-[13px] text-foreground/70 transition-all group-hover:gap-2 group-hover:text-foreground">
        View
        <span className="opacity-0 transition-opacity group-hover:opacity-100">→</span>
      </div>
    </Link>
  );
}
