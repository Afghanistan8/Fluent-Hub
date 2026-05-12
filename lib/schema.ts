import { z } from "zod";

/**
 * Categories for organizing dApps in the directory.
 * Add new ones here as the ecosystem grows.
 */
export const CategoryEnum = z.enum([
  "defi",
  "social",
  "gaming",
  "infrastructure",
  "identity",
  "prediction",
  "stablecoin",
  "tools",
]);

export type Category = z.infer<typeof CategoryEnum>;

/**
 * Status badge shown on each listing.
 * "live" = on Fluent mainnet, fully usable
 * "testnet" = on testnet only, no mainnet yet
 * "coming-soon" = announced but not deployed
 * "deprecated" = was live but no longer maintained
 */
export const StatusEnum = z.enum(["live", "testnet", "coming-soon", "deprecated"]);

export type Status = z.infer<typeof StatusEnum>;

/**
 * The "How to participate" structured fields.
 * This is the soul of the directory — every listing must fill these in
 * with the same shape, so users can scan across dApps and compare.
 */
export const ParticipationSchema = z.object({
  who_its_for: z.string().min(10).max(200),
  what_you_do: z.string().min(10).max(300),
  why_it_matters: z.string().min(10).max(300),
  entry_cost: z.string().min(3).max(150),
  reward_loop: z.string().min(10).max(300),
  time_to_first_value: z.string().min(3).max(100),
});

/**
 * Optional links a project might want to surface.
 */
export const LinksSchema = z.object({
  website: z.string().url(),
  twitter: z.string().url().optional(),
  discord: z.string().url().optional(),
  docs: z.string().url().optional(),
  github: z.string().url().optional(),
  contract_address: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
});

/**
 * The full frontmatter schema for every dApp .mdx file.
 * If a listing fails this validation, the build fails. That's the point.
 */
export const DappSchema = z.object({
  name: z.string().min(2).max(60),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must be lowercase, alphanumeric, hyphens only"),
  category: CategoryEnum,
  subcategory: z.string().optional(),
  tagline: z.string().min(10).max(120),
  logo: z.string().startsWith("/logos/"),
  status: StatusEnum,
  launched: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  featured: z.boolean().default(false),
  links: LinksSchema,
  participation: ParticipationSchema,
});

export type Dapp = z.infer<typeof DappSchema>;

/**
 * Loaded dApp includes everything from frontmatter plus the MDX body.
 */
export type LoadedDapp = Dapp & {
  body: string;
};
