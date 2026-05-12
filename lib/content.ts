import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { DappSchema, type LoadedDapp, type Category } from "./schema";

const DAPPS_DIR = path.join(process.cwd(), "content", "dapps");

/**
 * Reads all .mdx files in content/dapps, validates each one against
 * the schema, and returns the typed array. Build fails loudly if any
 * listing is malformed.
 */
export function getAllDapps(): LoadedDapp[] {
  if (!fs.existsSync(DAPPS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(DAPPS_DIR).filter((f) => f.endsWith(".mdx"));

  const dapps = files.map((filename) => {
    const filepath = path.join(DAPPS_DIR, filename);
    const raw = fs.readFileSync(filepath, "utf-8");
    const { data, content } = matter(raw);

    const result = DappSchema.safeParse(data);
    if (!result.success) {
      throw new Error(
        `Invalid dApp listing in ${filename}:\n${result.error.issues
          .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
          .join("\n")}`
      );
    }

    return {
      ...result.data,
      body: content,
    };
  });

  // Sort: featured first, then live > testnet > coming-soon > deprecated, then alphabetical
  const statusOrder = { live: 0, testnet: 1, "coming-soon": 2, deprecated: 3 };
  return dapps.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.status !== b.status) return statusOrder[a.status] - statusOrder[b.status];
    return a.name.localeCompare(b.name);
  });
}

export function getDappBySlug(slug: string): LoadedDapp | null {
  const dapps = getAllDapps();
  return dapps.find((d) => d.slug === slug) ?? null;
}

export function getDappsByCategory(category: Category): LoadedDapp[] {
  return getAllDapps().filter((d) => d.category === category);
}

export function getAllCategories(): Category[] {
  const dapps = getAllDapps();
  const cats = new Set<Category>();
  dapps.forEach((d) => cats.add(d.category));
  return Array.from(cats).sort();
}
