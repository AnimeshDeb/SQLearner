import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

//problem type from api we getting
export interface Problem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string; // The full markdown string
  slug: string;
}

const API_BASE_URL = "http://localhost:3000/api/problems"; 

export const ProblemDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [problem, setProblem] = useState<Problem | null>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sql, setSql] = useState("");

  useEffect(() => {
    if (!slug) {
        setLoading(false);
        return;
    }
    
    const fetchProblem = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${slug}`);
        
        if (response.status === 404) {
             setProblem(null);
             throw new Error("Problem not found.");
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Problem = await response.json();
        setProblem(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to fetch problem detail.");
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [slug]);


  if (loading) {
     return <div className="max-w-3xl mx-auto p-4">Loading problem details...</div>;
  }

  if (error || !problem) {
    return (
      <div className="max-w-3xl mx-auto p-4 bg-slate-50 min-h-screen">
        <p className="text-slate-900">{error || "Problem not found."}</p>
        <Link to="/problems" className="text-teal-500 hover:underline">
          Back to problems
        </Link>
      </div>
    );
  }

  const handleRun = async () => {
    const response=await fetch('http://localhost:3000/sqlrun', { 
      method: "POST",
      headers:  { 'Content-Type':'application/json' },
      body: JSON.stringify({ sql })

     })
     const data=await response.json()

     console.log("Sqlrun client data: ", data.output)
    console.log("Run SQL", { problemId: problem.id, sql });
  };

  //accessing markdoown from directly api call
  const markdown = problem.description;

  return (
    <div className="w-full mx-auto px-4 bg-slate-50 min-h-screen md:flex md:gap-6 md:h-[90vh]">
      
      <div className="flex-1 space-y-4 mb-4 md:mb-0 md:flex md:flex-col md:h-full"> 
        
        <div className="flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{problem.title}</h1>
            <p className="text-sm text-slate-700">
              Difficulty: {problem.difficulty}
            </p>
          </div>
          <Link 
            to="/problems" 
            className="text-teal-500 hover:text-teal-600 hover:underline text-sm transition duration-150 ease-in-out"
          >
            ← Back to problems
          </Link>
        </div>

        <div className="border border-slate-300 rounded-md p-4 bg-white shadow-lg overflow-y-auto flex-grow">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ node: _node, ...props }) => ( 
                <table
                  className="w-full my-3 border border-slate-300 border-collapse text-sm"
                  {...props}
                />
              ),
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
              p: ({ node: _node, ...props }) => (
                <p className="mb-2 leading-relaxed text-slate-900" {...props} />
              ),
              strong: ({ node: _node, ...props }) => (
                <strong className="font-semibold text-slate-900" {...props} />
              ),
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
      <div className="flex-1 space-y-4 md:h-full">
        <div className="bg-white border border-slate-300 rounded-md p-4 shadow-lg h-full">
          <h2 className="text-lg font-semibold mb-2 text-slate-900">SQL Editor</h2>
          <textarea
            className="w-full h-[calc(100%-80px)] border border-slate-300 rounded-md p-2 font-mono text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-150 ease-in-out resize-none"
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            placeholder="Write your SQL solution here..."
          />
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