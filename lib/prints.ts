/**
 * Fluent Prints API client.
 *
 * Endpoint: https://fluent-connect.api.fluent.xyz/api/v1/families/?id=<identifier>
 *
 * Accepts an X handle, wallet address, or Privy DID. Returns the user's
 * family tiers across four contexts: identity, tester, builder, influential.
 *
 * No auth required. Public API.
 *
 * Documentation: https://www.notion.so/fluent-labs/Prints-API-Service-All-Family-Tiers
 */

const PRINTS_API = "https://fluent-connect.api.fluent.xyz/api/v1/families/";

export type Tier = "A" | "B" | "C" | "D";
export type FamilyKey = "identity" | "tester" | "builder" | "influential";

export type FamilyEntry = {
  tier: Tier;
  lastUpdate: string;
};

export type PrintsResponse = {
  x_handle: string;
  families: Record<FamilyKey, FamilyEntry>;
};

export type PrintsLookupResult =
  | { ok: true; data: PrintsResponse; isDefault: boolean }
  | { ok: false; error: string };

/**
 * Looks up Prints families for a given identifier.
 * Returns ok: false with a friendly error message if the lookup fails.
 *
 * isDefault is true when all four families are tier D — likely means the user
 * either hasn't signed up for Prints, or hasn't accumulated enough activity yet.
 */
export async function getPrints(id: string): Promise<PrintsLookupResult> {
  const cleaned = cleanIdentifier(id);
  if (!cleaned) {
    return { ok: false, error: "Please enter an X handle, wallet address, or Privy DID." };
  }

  try {
    const url = `${PRINTS_API}?id=${encodeURIComponent(cleaned)}`;
    const res = await fetch(url, {
      next: { revalidate: 300 }, // 5 min cache per identifier
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return {
          ok: false,
          error: "This identifier isn't registered with Fluent Connect yet.",
        };
      }
      return {
        ok: false,
        error: `Prints API returned ${res.status}. Try again in a minute.`,
      };
    }

    const data = (await res.json()) as PrintsResponse;

    // Detect default response (all tiers = D)
    const tiers = Object.values(data.families).map((f) => f.tier);
    const isDefault = tiers.every((t) => t === "D");

    return { ok: true, data, isDefault };
  } catch (err) {
    console.error("Prints API fetch failed:", err);
    return {
      ok: false,
      error: "Couldn't reach the Prints API. Network or server issue.",
    };
  }
}

/**
 * Normalises whatever the user typed into something the API will accept.
 * Strips leading "@" from X handles, trims whitespace.
 */
function cleanIdentifier(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  // Strip leading @ from X handles
  if (trimmed.startsWith("@")) return trimmed.slice(1);
  return trimmed;
}

/**
 * Identifier type detection for UI hints.
 */
export function detectIdentifierType(
  id: string
): "wallet" | "privy" | "handle" {
  const trimmed = id.trim().replace(/^@/, "");
  if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) return "wallet";
  if (trimmed.startsWith("did:privy:")) return "privy";
  return "handle";
}

/**
 * Tier display info — colors, labels, ordering.
 * A is best, D is default/lowest.
 */
export const TIER_INFO: Record<Tier, { label: string; rank: number; description: string }> = {
  A: { label: "A", rank: 1, description: "Top tier" },
  B: { label: "B", rank: 2, description: "Strong" },
  C: { label: "C", rank: 3, description: "Active" },
  D: { label: "D", rank: 4, description: "Default" },
};

/**
 * Family display info — labels, short descriptions.
 */
export const FAMILY_INFO: Record<FamilyKey, { label: string; description: string }> = {
  identity: {
    label: "Identity",
    description: "Human verification & identity signals",
  },
  tester: {
    label: "Tester",
    description: "Ecosystem testing & participation",
  },
  builder: {
    label: "Builder",
    description: "Development & contribution signals",
  },
  influential: {
    label: "Influential",
    description: "Social reach & influence signals",
  },
};

export const FAMILY_ORDER: FamilyKey[] = [
  "identity",
  "tester",
  "builder",
  "influential",
];

/**
 * Computes an aggregate "score" out of 100 for sorting/display.
 * A=100, B=75, C=50, D=25. Averaged across families.
 */
export function computeOverallScore(families: PrintsResponse["families"]): number {
  const tierToScore: Record<Tier, number> = { A: 100, B: 75, C: 50, D: 25 };
  const scores = Object.values(families).map((f) => tierToScore[f.tier]);
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}
