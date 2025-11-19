// src/pages/ProblemsList.tsx
import React from "react";
import { Link } from "react-router-dom";
import { problems } from "../data/problems";

const difficultyColor: Record<string, string> = {
  Easy: "text-green-600",
  Medium: "text-yellow-600",
  Hard: "text-red-600"
};

export const ProblemsList: React.FC = () => {
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
