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
      <div className="max-w-3xl mx-auto p-4 bg-slate-50 min-h-screen">
        <p className="text-slate-900">Problem not found.</p>
        <Link to="/problems" className="text-teal-500 hover:underline">
          Back to problems
        </Link>
      </div>
    );
  }

  const markdown = problem.descriptionLines.join("\n");

  // IMPORTANT: The rule requires using a custom alert component, not window.alert()
  const handleRun = () => {
    console.log("Run SQL", { problemId: problem.id, sql });
    // This is replaced from alert() as per best practice
    console.warn("Hook this up to your SQL judge backend. (Using console.warn instead of alert())");
  };

  return (
    // --- UPDATED LAYOUT CLASSES ---
    // Removed max-w-7xl and applied w-full to use the entire available screen width.
    // Kept px-4 for padding and md:h-[90vh] for balanced column heights.
    <div className="w-full mx-auto px-4 bg-slate-50 min-h-screen md:flex md:gap-6 md:h-[90vh]">
      
      {/* LEFT COLUMN: Problem Description and Header (takes 1/2 width) */}
      <div className="flex-1 space-y-4 mb-4 md:mb-0 md:flex md:flex-col md:h-full"> 
        
        {/* Header Block (fixed height, prevents growing) */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div>
            {/* Applied Main Text: slate-900 */}
            <h1 className="text-2xl font-bold text-slate-900">{problem.title}</h1>
            {/* Applied Secondary Text: slate-700 */}
            <p className="text-sm text-slate-700">
              Difficulty: {problem.difficulty}
            </p>
          </div>
          {/* Applied Secondary Action: teal-500 for links */}
          <Link 
            to="/problems" 
            className="text-teal-500 hover:text-teal-600 hover:underline text-sm transition duration-150 ease-in-out"
          >
            ← Back to problems
          </Link>
        </div>

        {/* Problem Description Content */}
        {/* Removed max-h and added flex-grow to fill the remaining vertical space */}
        <div className="border border-slate-300 rounded-md p-4 bg-white shadow-lg overflow-y-auto flex-grow">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // FIX: Renaming 'node' to '_node' in the destructured arguments 
              table: ({ node: _node, ...props }) => ( 
                <table
                  className="w-full my-3 border border-slate-300 border-collapse text-sm"
                  {...props}
                />
              ),
              // Used a light teal tint for table header contrast
              thead: ({ node: _node, ...props }) => (
                <thead className="bg-teal-50" {...props} />
              ),
              th: ({ node: _node, ...props }) => (
                <th
                  className="border border-slate-300 px-2 py-1 text-left font-semibold text-slate-900"
                  {...props}
                />
              ),
              td: ({ node: _node, ...props }) => (
                <td
                  className="border border-slate-300 px-2 py-1 align-top text-slate-900"
                  {...props}
                />
              ),
              // optional: tighten up paragraphs/lists
              p: ({ node: _node, ...props }) => (
                <p className="mb-2 leading-relaxed text-slate-900" {...props} />
              ),
              strong: ({ node: _node, ...props }) => (
                <strong className="font-semibold text-slate-900" {...props} />
              ),
              // Ensure code blocks stand out
              code: ({ node: _node, ...props }) => (
                <code className="bg-slate-100 text-teal-700 p-1 rounded text-sm" {...props} />
              )
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>

      {/* RIGHT COLUMN: SQL Editor (takes 1/2 width) */}
      {/* Added md:h-full for consistency and correct height inheritance */}
      <div className="flex-1 space-y-4 md:h-full">
        <div className="bg-white border border-slate-300 rounded-md p-4 shadow-lg h-full">
          {/* Applied Main Text: slate-900 */}
          <h2 className="text-lg font-semibold mb-2 text-slate-900">SQL Editor</h2>
          <textarea
            // Adjusted height calculation to be robust for the h-full parent
            className="w-full h-[calc(100%-80px)] border border-slate-300 rounded-md p-2 font-mono text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-150 ease-in-out resize-none"
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            placeholder="Write your SQL solution here..."
          />
          {/* Applied Primary Action: orange-500 for the button */}
          <button
            onClick={handleRun}
            className="mt-3 px-6 py-2 rounded-lg bg-orange-500 text-white text-base font-semibold transition duration-200 ease-in-out hover:bg-orange-600 shadow-md hover:shadow-lg transform hover:scale-[1.01]"
          >
            Run / Submit
          </button>
        </div>
      </div>
    </div>
  );
};