// src/pages/ProblemsList.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// --- Types ---
interface ProblemSummary {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  slug: string;
}

// The structure received from the backend (Option B: Ordered Array)
interface CategoryGroup {
  category: string;
  problems: ProblemSummary[];
}

const difficultyColor: Record<string, string> = {
  Easy: "text-green-600",
  Medium: "text-yellow-600",
  Hard: "text-red-600",
};

const API_BASE_URL = "http://localhost:3000/api/problems"; 

export const ProblemsList: React.FC = () => {
  // State now holds the array of groups, not a flat list
  const [problemGroups, setProblemGroups] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: CategoryGroup[] = await response.json();
        setProblemGroups(data);
      } catch (e) {
        setError("Failed to fetch problems.");
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return <div className="max-w-4xl mx-auto p-4 text-gray-600">Loading problems...</div>;
  }

  if (error) {
    return <div className="max-w-4xl mx-auto p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">SQL Problems</h1>
      
      {problemGroups.map((group) => (
        <div key={group.category} className="mb-10">
          
          {/* Subtitle / Category Header */}
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
            {group.category}
          </h2>

          {/* Table */}
          <div className="overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 w-16 font-medium text-gray-600 border-b">#</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 border-b">Title</th>
                  <th className="text-left py-3 px-4 w-32 font-medium text-gray-600 border-b">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {group.problems.map((p, index) => (
                  <tr 
                    key={p.id} 
                    className={`hover:bg-gray-50 transition-colors ${
                      index !== group.problems.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <td className="py-3 px-4 text-sm text-gray-500">{p.id}</td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/problems/${p.slug}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        {p.title}
                      </Link>
                    </td>
                    <td className={`py-3 px-4 text-sm font-semibold ${difficultyColor[p.difficulty]}`}>
                      {p.difficulty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};