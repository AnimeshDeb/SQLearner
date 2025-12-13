import raw from "./problems.json";

export type Difficulty = "Easy" | "Medium" | "Hard";

interface ProblemFromJson {
  id: number;
  title: string;
  difficulty: Difficulty;
  description: string;
  correctQuery: string;
  sourceTableQuery: string;
  hints: string[]; 
}

export interface Problem extends ProblemFromJson {
  slug: string;
  descriptionLines: string[];
}

export interface CategoryGroup {
  category: string;
  problems: Omit<Problem, "description" | "descriptionLines">[];
}

function makeSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// 1. Process raw data once
export const problems: Problem[] = (raw as ProblemFromJson[]).map((p) => ({
  ...p,
  slug: makeSlug(p.title),
  descriptionLines: p.description.split("\n"),
}));

// 2. Define Categories and Manual ID mapping
// IDs 1-50 mapped to their specific Business Domains
const CATEGORY_MAP: Record<string, number[]> = {
  "E-commerce & Retail": [1, 8, 15, 22, 29, 35, 45, 50],
  "Fintech & Payments": [4, 10, 17, 23, 30, 36, 42, 49],
  "SaaS & User Growth": [6, 13, 20, 24, 31, 37, 43, 48],
  "Logistics & Supply Chain": [5, 12, 19, 25, 32, 38, 47],
  "HR & People Analytics": [2, 9, 16, 21, 28, 39, 41],
  "Social Media & Content": [3, 11, 18, 26, 33, 40, 46],
  "Healthcare": [7, 14, 27, 34, 44]
};

// 3. Define the explicit order for the UI
const CATEGORY_ORDER = [
  "E-commerce & Retail",
  "Fintech & Payments",
  "SaaS & User Growth",
  "Logistics & Supply Chain",
  "HR & People Analytics",
  "Social Media & Content",
  "Healthcare"
];

// 4. Helper to return single problem by slug (unchanged)
export function getProblemBySlug(slug: string): Problem | undefined {
  return problems.find((p) => p.slug === slug);
}

// 5. Helper to return grouped problems
export function getGroupedProblems(): CategoryGroup[] {
  const groupedResult: CategoryGroup[] = [];
  const categorizedIds = new Set<number>();

  // Iterate through defined order
  CATEGORY_ORDER.forEach((catName) => {
    const ids = CATEGORY_MAP[catName];
    // Filter problems that match IDs in this category
    const catProblems = problems
      .filter((p) => ids.includes(p.id))
      .map(({ description, descriptionLines, ...rest }) => rest); // Strip heavy fields

    if (catProblems.length > 0) {
      groupedResult.push({
        category: catName,
        problems: catProblems,
      });
      catProblems.forEach(p => categorizedIds.add(p.id));
    }
  });

  // Handle "Uncategorized" (Any ID in json that wasn't in our map)
  const uncategorized = problems
    .filter((p) => !categorizedIds.has(p.id))
    .map(({ description, descriptionLines, ...rest }) => rest);

  if (uncategorized.length > 0) {
    groupedResult.push({
      category: "Uncategorized",
      problems: uncategorized,
    });
  }

  return groupedResult;
}