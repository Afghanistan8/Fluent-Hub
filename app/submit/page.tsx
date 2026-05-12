import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Submit a dApp",
  description: "Add your Fluent project via pull request.",
};

export default function SubmitPage() {
  return (
    <div className="container-narrow py-14">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to home
      </Link>

      <div className="flex flex-col gap-3">
        <span className="font-mono text-2xs uppercase tracking-wider text-accent">Submit</span>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Submit a dApp</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Fluent Hub listings live in a public GitHub repo. Add your project by opening a pull
          request with a new <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">.mdx</code> file in{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">content/dapps/</code>.
        </p>
      </div>

      <section className="mt-12">
        <span className="font-mono text-2xs uppercase tracking-wider text-accent">Criteria</span>
        <h2 className="mt-2 text-lg font-semibold tracking-tight">Inclusion criteria</h2>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-accent">·</span> Deployed on Fluent (mainnet, testnet, or publicly announced)
          </li>
          <li className="flex gap-2">
            <span className="text-accent">·</span> Has a working frontend or is in active development
          </li>
          <li className="flex gap-2">
            <span className="text-accent">·</span> Team has a verifiable on-chain presence
          </li>
          <li className="flex gap-2">
            <span className="text-accent">·</span> Not a copy-paste fork with no novel functionality
          </li>
        </ul>
      </section>

      <section className="mt-12">
        <span className="font-mono text-2xs uppercase tracking-wider text-accent">Format</span>
        <h2 className="mt-2 text-lg font-semibold tracking-tight">Listing template</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Every listing answers the same six questions: who it&apos;s for, what you do, why it
          matters, entry cost, reward loop, and time to first value.
        </p>
        <pre className="mt-6 overflow-x-auto rounded-lg border border-border bg-muted/40 p-5 font-mono text-2xs leading-relaxed text-muted-foreground">
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

      <p className="mt-10 text-sm text-muted-foreground">
        Open a PR on <a href="https://github.com" className="text-accent hover:underline">GitHub</a>. Approvals usually within 48 hours.
      </p>
    </div>
  );
}
