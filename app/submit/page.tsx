import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Submit a dApp",
  description: "Add your Fluent project via pull request.",
};

export default function SubmitPage() {
  return (
    <div className="container-narrow py-20">
      <Link
        href="/"
        className="mb-10 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to home
      </Link>

      <div className="flex flex-col gap-3">
        <span className="eyebrow eyebrow-accent">Submit</span>
        <h1 className="text-[44px] font-semibold leading-[1.05] tracking-tight sm:text-[56px]">
          Submit a dApp.
        </h1>
        <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Listings live in a public GitHub repo. Add your project by opening a pull request
          with a new <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px]">.mdx</code> file in{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px]">content/dapps/</code>.
        </p>
      </div>

      <section className="mt-16">
        <span className="eyebrow eyebrow-accent">Criteria</span>
        <h2 className="mt-3 text-[24px] font-semibold tracking-tight">Inclusion criteria</h2>
        <ul className="mt-5 flex flex-col gap-3 text-[14px] text-muted-foreground">
          <li className="flex gap-3">
            <span className="text-accent">·</span>
            Deployed on Fluent (mainnet, testnet, or publicly announced)
          </li>
          <li className="flex gap-3">
            <span className="text-accent">·</span>
            Has a working frontend or is in active development
          </li>
          <li className="flex gap-3">
            <span className="text-accent">·</span>
            Team has a verifiable on-chain presence
          </li>
          <li className="flex gap-3">
            <span className="text-accent">·</span>
            Not a copy-paste fork with no novel functionality
          </li>
        </ul>
      </section>

      <section className="mt-16">
        <span className="eyebrow eyebrow-accent">Format</span>
        <h2 className="mt-3 text-[24px] font-semibold tracking-tight">Listing template</h2>
        <p className="mt-3 text-[14px] text-muted-foreground">
          Every listing answers the same six questions: who it&apos;s for, what you do, why it
          matters, entry cost, reward loop, and time to first value.
        </p>
        <pre className="mt-6 overflow-x-auto rounded-xl border border-border bg-background-elevated p-6 font-mono text-[12px] leading-relaxed text-muted-foreground">
{`---
name: Your dApp
slug: your-dapp
category: defi
tagline: One line that explains what you do.
logo: /logos/your-dapp.png
status: live
featured: false
links:
  website: https://your-dapp.xyz
  twitter: https://twitter.com/yourdapp
participation:
  who_its_for: "DeFi users who want X."
  what_you_do: "Deposit, do Y, withdraw."
  why_it_matters: "Z benefit only possible on Fluent."
  entry_cost: "Gas only. No minimum deposit."
  reward_loop: "Earn points -> unlock tiers -> boost yield."
  time_to_first_value: "Under 2 minutes."
---

## About

Longer-form description goes here.
`}
        </pre>
      </section>

      <p className="mt-10 text-[14px] text-muted-foreground">
        Open a PR on{" "}
        <a
          href="https://github.com/Afghanistan8/fluent-hub"
          target="_blank"
          rel="noreferrer"
          className="text-accent hover:underline"
        >
          GitHub
        </a>
        . Approvals usually within 48 hours.
      </p>
    </div>
  );
}
