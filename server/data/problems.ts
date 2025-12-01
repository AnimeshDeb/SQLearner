import raw from "./problems.json";

export type Difficulty = "Easy" | "Medium" | "Hard";

interface ProblemFromJson {
  id: number;
  title: string;
  difficulty: Difficulty;
  description: string;
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
const CATEGORY_MAP: Record<string, number[]> = {
  "Basic Selects & Filtering": [1, 31, 34, 35, 38, 42, 44, 46, 49],
  
  // Added 96 (Dept Highest Salary)
  "Basic Aggregation & Grouping": [2, 7, 9, 32, 33, 37, 40, 41, 45, 50, 51, 69, 96], 
  
  // Added 91 (Combine Tables), 95 (Employees > Managers)
  "Joins & Set Operations": [3, 4, 10, 11, 15, 16, 55, 70, 91, 95], 
  
  // Added 98 (Rising Temperature - Date Logic)
  "String, Date & Time Manipulation": [5, 36, 39, 48, 53, 25, 98], 
  
  // Added 92, 93, 94, 97 (Ranking & Consecutive Logic)
  "Window Functions": [6, 8, 12, 13, 14, 17, 18, 19, 24, 26, 28, 43, 52, 54, 58, 60, 68, 77, 85, 92, 93, 94, 97], 
  
  "Recursive & Hierarchical Data": [22, 23, 74, 75, 81, 88],
  
  // Added 99 (Trips & Users), 100 (Exchange Seats - Logic Heavy)
  "Advanced Analytics & Business Logic": [20, 21, 27, 29, 30, 56, 57, 59, 61, 62, 63, 64, 65, 66, 67, 71, 72, 73, 76, 78, 79, 80, 82, 83, 84, 86, 87, 89, 90, 99, 100]
};

// 3. Define the explicit order for the UI
const CATEGORY_ORDER = [
  "Basic Selects & Filtering",
  "Basic Aggregation & Grouping",
  "Joins & Set Operations",
  "String, Date & Time Manipulation",
  "Window Functions",
  "Recursive & Hierarchical Data",
  "Advanced Analytics & Business Logic"
];

// 4. Helper to return single problem by slug (unchanged)
export function getProblemBySlug(slug: string): Problem | undefined {
  return problems.find((p) => p.slug === slug);
}

// 5. NEW: Helper to return grouped problems
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