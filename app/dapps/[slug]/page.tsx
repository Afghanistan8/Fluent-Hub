import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getDappBySlug, getAllDapps } from "@/lib/content";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/lib/labels";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  Twitter,
  MessageCircle,
  BookOpen,
  Github,
  ArrowLeft,
} from "lucide-react";
import { ParticipationBlock } from "@/components/ParticipationBlock";
import type { LoadedDapp } from "@/lib/schema";

const STATUS_DOT_CLASS: Record<LoadedDapp["status"], string> = {
  live: "status-dot-live",
  testnet: "status-dot-testnet",
  "coming-soon": "status-dot-coming-soon",
  deprecated: "status-dot-deprecated",
};

export async function generateStaticParams() {
  return getAllDapps().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dapp = getDappBySlug(slug);
  if (!dapp) return {};
  return {
    title: dapp.name,
    description: dapp.tagline,
  };
}

export default async function DappPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dapp = getDappBySlug(slug);
  if (!dapp) notFound();

  return (
    <article className="container-narrow py-16">
      <Link
        href="/dapps"
        className="mb-10 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to directory
      </Link>

      <header className="reveal mb-14 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-5">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-background-elevated">
            <Image
              src={dapp.logo}
              alt={`${dapp.name} logo`}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[36px] font-semibold tracking-tight">{dapp.name}</h1>
              <span className="flex items-center gap-1.5 rounded-md border border-border bg-muted px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <span className={cn("status-dot", STATUS_DOT_CLASS[dapp.status])} />
                {STATUS_LABELS[dapp.status]}
              </span>
            </div>
            <p className="mt-2 max-w-xl text-[15px] text-muted-foreground">{dapp.tagline}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Link
                href={`/categories/${dapp.category}`}
                className="rounded-md border border-border bg-muted px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                {CATEGORY_LABELS[dapp.category]}
              </Link>
              {dapp.subcategory && (
                <span className="rounded-md border border-border bg-muted px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {dapp.subcategory}
                </span>
              )}
            </div>
          </div>
        </div>

        <a
          href={dapp.links.website}
          target="_blank"
          rel="noreferrer"
          className="btn-primary inline-flex shrink-0 items-center gap-2 rounded-md px-4 py-2.5 text-[14px] font-medium"
        >
          Visit {dapp.name}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </header>

      <ParticipationBlock participation={dapp.participation} />

      {dapp.body.trim() && (
        <section className="mt-20 border-t border-border pt-12">
          <span className="eyebrow eyebrow-accent">About</span>
          <h2 className="mt-3 text-[28px] font-semibold tracking-tight">
            About {dapp.name}
          </h2>
          <div className="mt-6 whitespace-pre-wrap text-[15px] leading-relaxed text-subtle">
            {dapp.body}
          </div>
        </section>
      )}

      <section className="mt-20 border-t border-border pt-12">
        <span className="eyebrow eyebrow-accent">Links</span>
        <h2 className="mt-3 text-[28px] font-semibold tracking-tight">External resources</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          <LinkPill href={dapp.links.website} icon={<ExternalLink className="h-3.5 w-3.5" />}>
            Website
          </LinkPill>
          {dapp.links.twitter && (
            <LinkPill href={dapp.links.twitter} icon={<Twitter className="h-3.5 w-3.5" />}>
              Twitter
            </LinkPill>
          )}
          {dapp.links.discord && (
            <LinkPill href={dapp.links.discord} icon={<MessageCircle className="h-3.5 w-3.5" />}>
              Discord
            </LinkPill>
          )}
          {dapp.links.docs && (
            <LinkPill href={dapp.links.docs} icon={<BookOpen className="h-3.5 w-3.5" />}>
              Docs
            </LinkPill>
          )}
          {dapp.links.github && (
            <LinkPill href={dapp.links.github} icon={<Github className="h-3.5 w-3.5" />}>
              GitHub
            </LinkPill>
          )}
        </div>
        {dapp.links.contract_address && (
          <p className="mt-6 text-[12px] uppercase tracking-wider text-muted-foreground">
            Contract ·{" "}
            <span className="font-mono text-foreground normal-case tracking-normal">
              {dapp.links.contract_address}
            </span>
          </p>
        )}
      </section>
    </article>
  );
}

function LinkPill({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background-elevated px-3 py-1.5 text-[13px] font-medium text-muted-foreground hover-bright hover:border-border-strong hover:bg-muted hover:text-foreground"
    >
      {icon}
      {children}
    </a>
  );
}
