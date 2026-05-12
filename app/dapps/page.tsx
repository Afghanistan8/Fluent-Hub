import Link from "next/link";
import { getAllDapps, getAllCategories } from "@/lib/content";
import { CATEGORY_LABELS } from "@/lib/labels";
import { DappCard } from "@/components/DappCard";

export const metadata = {
  title: "Directory",
  description: "Every dApp on the Fluent ecosystem.",
};

export default function DappsPage() {
  const dapps = getAllDapps();
  const categories = getAllCategories();

  return (
    <div className="container-wide py-14">
      <div className="mb-10 flex flex-col gap-3">
        <span className="font-mono text-2xs uppercase tracking-wider text-accent">Directory</span>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          All dApps on Fluent
        </h1>
        <p className="text-sm text-muted-foreground">
          {dapps.length} project{dapps.length !== 1 ? "s" : ""} tracked. Every listing follows the same six-field format for fair comparison.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-1.5 border-b border-border pb-6">
        <FilterPill href="/dapps" active>
          All <span className="ml-1 text-muted-foreground">{dapps.length}</span>
        </FilterPill>
        {categories.map((cat) => {
          const count = dapps.filter((d) => d.category === cat).length;
          return (
            <FilterPill key={cat} href={`/categories/${cat}`}>
              {CATEGORY_LABELS[cat]} <span className="ml-1 text-muted-foreground">{count}</span>
            </FilterPill>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dapps.map((dapp, i) => (
          <div
            key={dapp.slug}
            className="reveal bg-background"
            style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
          >
            <DappCard dapp={dapp} />
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterPill({
  href,
  active = false,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-2xs uppercase tracking-wider text-accent"
          : "rounded-md border border-border bg-muted/30 px-3 py-1.5 font-mono text-2xs uppercase tracking-wider text-muted-foreground hover-bright hover:bg-muted hover:text-foreground"
      }
    >
      {children}
    </Link>
  );
}
