// src/pages/ProblemDetail.tsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getProblemBySlug } from "../data/problems";

export const ProblemDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const problem = slug ? getProblemBySlug(slug) : undefined;
  const [sql, setSql] = useState("");

  if (!problem) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <p>Problem not found.</p>
        <Link to="/problems" className="text-blue-600 hover:underline">
          Back to problems
        </Link>
      </div>
    );
  }

  const markdown = problem.descriptionLines.join("\n");

  const handleRun = () => {
    console.log("Run SQL", { problemId: problem.id, sql });
    alert("Hook this up to your SQL judge backend.");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{problem.title}</h1>
          <p className="text-sm text-gray-500">
            Difficulty: {problem.difficulty}
          </p>
        </div>
        <Link to="/problems" className="text-blue-600 hover:underline text-sm">
          ← Back to problems
        </Link>
      </div>

      <div className="border rounded-md p-4 bg-white">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            table: ({ node, ...props }) => (
              <table
                className="w-full my-3 border border-gray-300 border-collapse text-sm"
                {...props}
              />
            ),
            thead: ({ node, ...props }) => (
              <thead className="bg-gray-50" {...props} />
            ),
            th: ({ node, ...props }) => (
              <th
                className="border border-gray-300 px-2 py-1 text-left font-semibold"
                {...props}
              />
            ),
            td: ({ node, ...props }) => (
              <td
                className="border border-gray-300 px-2 py-1 align-top"
                {...props}
              />
            ),
            // optional: tighten up paragraphs/lists
            p: ({ node, ...props }) => (
              <p className="mb-2 leading-relaxed" {...props} />
            ),
            strong: ({ node, ...props }) => (
              <strong className="font-semibold" {...props} />
            )
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">SQL Editor</h2>
        <textarea
          className="w-full h-56 border rounded-md p-2 font-mono text-sm"
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          placeholder="Write your SQL solution here..."
        />
        <button
          onClick={handleRun}
          className="mt-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm"
        >
          Run / Submit
        </button>
      </div>
    </div>
  );
};
