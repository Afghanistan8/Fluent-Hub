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
    <div className="container-wide py-20">
      <div className="mb-12 flex flex-col gap-3">
        <span className="eyebrow eyebrow-accent">Directory</span>
        <h1 className="text-[44px] font-semibold leading-[1.05] tracking-tight sm:text-[56px]">
          All dApps on Fluent.
        </h1>
        <p className="max-w-xl text-[15px] text-muted-foreground">
          {dapps.length} project{dapps.length !== 1 ? "s" : ""} tracked. Every listing
          follows the same six-field format for fair comparison.
        </p>
      </div>

      <div className="mb-10 flex flex-wrap gap-2 border-b border-border pb-8">
        <FilterPill href="/dapps" active>
          All <span className="ml-1.5 text-muted-foreground">{dapps.length}</span>
        </FilterPill>
        {categories.map((cat) => {
          const count = dapps.filter((d) => d.category === cat).length;
          return (
            <FilterPill key={cat} href={`/categories/${cat}`}>
              {CATEGORY_LABELS[cat]}{" "}
              <span className="ml-1.5 text-muted-foreground">{count}</span>
            </FilterPill>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dapps.map((dapp, i) => (
          <div
            key={dapp.slug}
            className="reveal"
            style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
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
          ? "rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 text-[12px] font-medium text-accent"
          : "rounded-md border border-border bg-background-elevated px-3 py-1.5 text-[12px] font-medium text-muted-foreground hover-bright hover:border-border-strong hover:bg-muted hover:text-foreground"
      }
    >
      {children}
    </Link>
  );
}
