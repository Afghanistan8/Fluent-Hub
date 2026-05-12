# Fluent Hub

The front door to the Fluent ecosystem. A directory of every Fluent dApp, plus reputation
leaderboards and network comparison (coming).

## What this is

Three product surfaces, shipping in phases:

1. **Directory** (Phase 1, shipping now) — every Fluent dApp with a standardized "how to participate" template.
2. **Reputation Leaderboards** (Phase 2) — multi-context Prints standings + per-wallet lookup.
3. **Network Comparison** (Phase 2) — Fluent vs other zk-rollups on revenue, TVL, activity.

## Stack

- Next.js 15 (App Router, React Server Components)
- TypeScript
- Tailwind CSS
- MDX content files in `content/dapps/` validated with Zod
- Deploys on Vercel

## Why MDX-in-repo instead of a CMS

- **Free, no extra service to manage.**
- **Every edit has Git history.** You can see who changed what, when, and why.
- **dApp teams can submit themselves via pull request.** That doubles as community engagement and gives you a public artifact of every approval.
- **Schema validation at build time.** If a listing is missing a field, the build fails. No bad data in production.
- **Deploys are atomic.** Push to main → Vercel rebuilds → site updates in 30 seconds.

If you ever outgrow this (you won't for the first year), migrating MDX → CMS is mechanical.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

To validate all content files without building:

```bash
npm run validate
```

## Adding a dApp

Create a new `.mdx` file in `content/dapps/`. Use [sprout.mdx](./content/dapps/sprout.mdx) as a
template. The frontmatter is validated against the schema in [`lib/schema.ts`](./lib/schema.ts) —
if you miss a field, the build fails with a clear error message.

## Content architecture

```
content/
  dapps/
    vena.mdx              ← one file per dApp
    yumi.mdx
    pulse-predictor.mdx
    sprout.mdx
```

Each `.mdx` file has:
- **Frontmatter** (the structured fields: name, category, links, participation template)
- **Body** (long-form description in markdown)

The schema enforces the "how to participate" template — six fields every listing must answer:

1. Who it's for
2. What you do
3. Why it matters
4. Entry cost
5. Reward loop
6. Time to first value

This is the single most important design decision. Standardization is what makes a directory
feel professional instead of personal-blog.

## What's NOT in this repo (yet)

- The reputation leaderboards (Phase 2 — waiting on Prints API access)
- The network comparison dashboard (Phase 2 — once directory is fully populated)
- A search/filter UI (Phase 1.5 — once there are ~15+ listings)

## License

MIT.
