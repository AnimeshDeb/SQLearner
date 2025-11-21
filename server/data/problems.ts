// backend-server/data/problems.ts
// Note: Changed the import to use a default export for 'raw'
import raw from "./problems.json";

export type Difficulty = "Easy" | "Medium" | "Hard";

interface ProblemFromJson {
  id: number;
  title: string;
  difficulty: Difficulty;
  description: string; // single markdown string
}

export interface Problem extends ProblemFromJson {
  slug: string;
  descriptionLines: string[]; // This is now a convenience property for *either* FE/BE, but FE won't use it directly now.
}

function makeSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// The core problem data, processed once at startup
export const problems: Problem[] = (raw as ProblemFromJson[]).map((p) => ({
  ...p,
  slug: makeSlug(p.title),
  descriptionLines: p.description.split("\n"),
}));

//returning a list of all problems
export function getAllProblemsSummary() {
  return problems.map(({ description, descriptionLines, ...rest }) => rest);
}

//returning a data about single problem based on the slud
export function getProblemBySlug(slug: string): Problem | undefined {
  return problems.find((p) => p.slug === slug);
}