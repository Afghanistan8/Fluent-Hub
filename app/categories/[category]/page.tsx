import { notFound } from "next/navigation";
import Link from "next/link";
import { getDappsByCategory, getAllCategories } from "@/lib/content";
import { CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from "@/lib/labels";
import { DappCard } from "@/components/DappCard";
import { CategoryEnum, type Category } from "@/lib/schema";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  return getAllCategories().map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const parsed = CategoryEnum.safeParse(category);
  if (!parsed.success) return {};
  return {
    title: `${CATEGORY_LABELS[parsed.data]} dApps`,
    description: CATEGORY_DESCRIPTIONS[parsed.data],
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const parsed = CategoryEnum.safeParse(category);
  if (!parsed.success) notFound();

  const cat: Category = parsed.data;
  const dapps = getDappsByCategory(cat);

  return (
    <div className="container-wide py-20">
      <Link
        href="/dapps"
        className="mb-10 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All dApps
      </Link>
      <div className="mb-14 flex flex-col gap-3">
        <span className="eyebrow eyebrow-accent">Category</span>
        <h1 className="text-[44px] font-semibold leading-[1.05] tracking-tight sm:text-[56px]">
          {CATEGORY_LABELS[cat]}.
        </h1>
        <p className="max-w-xl text-[15px] text-muted-foreground">
          {CATEGORY_DESCRIPTIONS[cat]}
        </p>
      </div>

      {dapps.length === 0 ? (
        <p className="text-[14px] text-muted-foreground">No dApps in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dapps.map((dapp, i) => (
            <div
              key={dapp.slug}
              className="reveal"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <DappCard dapp={dapp} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
