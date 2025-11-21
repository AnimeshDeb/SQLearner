// src/pages/ProblemsList.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Define the type for the data we expect to fetch
interface ProblemSummary {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  slug: string;
}

const difficultyColor: Record<string, string> = {
  Easy: "text-green-600",
  Medium: "text-yellow-600",
  Hard: "text-red-600"
};

const API_BASE_URL = "http://localhost:3000/api/problems"; // <-- Adjust port if necessary

export const ProblemsList: React.FC = () => {
  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ProblemSummary[] = await response.json();
        setProblems(data);
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
    return <div className="max-w-4xl mx-auto p-4">Loading problems...</div>;
  }

  if (error) {
    return <div className="max-w-4xl mx-auto p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">SQL Problems</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-2 w-16">#</th>
            <th className="text-left py-2 px-2">Title</th>
            <th className="text-left py-2 px-2 w-24">Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((p) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-2 text-sm text-gray-500">{p.id}</td>
              <td className="py-2 px-2">
                <Link
                  to={`/problems/${p.slug}`}
                  className="text-blue-600 hover:underline"
                >
                  {p.title}
                </Link>
              </td>
              <td className={`py-2 px-2 text-sm font-semibold ${difficultyColor[p.difficulty]}`}>
                {p.difficulty}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};