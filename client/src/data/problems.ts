// src/data/problems.ts
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
  descriptionLines: string[]; // for your ProblemDetail
}

function makeSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const problems: Problem[] = (raw as ProblemFromJson[]).map((p) => ({
  ...p,
  slug: makeSlug(p.title),
  descriptionLines: p.description.split("\n"),
}));

export function getProblemBySlug(slug: string): Problem | undefined {
  return problems.find((p) => p.slug === slug);
}
