import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  slug: string;
}

const API_BASE_URL = 'http://localhost:3000/api/problems';

export const ProblemDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Input State
  const [sql, setSql] = useState('');

  // Execution State - Typed as an array of objects with unknown values
  const [userOutput, setUserOutput] = useState<Record<string, unknown>[] | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Reset state when navigating to a new problem
    setUserOutput(null);
    setIsCorrect(null);
    setShowModal(false);
    setSql('');

    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchProblem = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${slug}`);

        if (response.status === 404) {
          setProblem(null);
          throw new Error('Problem not found.');
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Problem = await response.json();
        setProblem(data);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : 'Failed to fetch problem detail.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [slug]);

  const handleRun = async () => {
    try {
      const response = await fetch('http://localhost:3000/sqlrun', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql, slug }),
      });
      
      const data = await response.json();
      
      // Update state with results from the backend
      setUserOutput(data.userOutput);
      setIsCorrect(data.isCorrect);
      setShowModal(true); // Trigger the popup result

    } catch (e) {
      console.error("Run error:", e);
      alert("Failed to connect to the execution server.");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error || !problem) return <div className="p-4 text-red-500">{error || 'Problem not found'}</div>;

  const markdown = problem.description;

  return (
    <div className="w-full mx-auto px-4 bg-slate-50 min-h-screen md:flex md:gap-6 md:h-[90vh] py-6 relative">
      
      {/* --- MODAL / POPUP --- */}
      {showModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all scale-100 ${isCorrect ? 'border-t-8 border-green-500' : 'border-t-8 border-red-500'}`}>
            
            {isCorrect ? (
              <>
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">You did it!</h2>
                <p className="text-gray-600 mb-6">Your query produced the exact expected results.</p>
                <div className="flex gap-3 justify-center">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                  <Link 
                    to="/problems" 
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Back to Problems
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">❌</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Incorrect</h2>
                <p className="text-gray-600 mb-6">Your output didn't match the expected result. Check your logic.</p>
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* --- LEFT COLUMN: Description --- */}
      <div className="flex-1 space-y-4 mb-4 md:mb-0 md:flex md:flex-col md:h-full overflow-hidden"> 
        <div className="flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{problem.title}</h1>
            <p className="text-sm text-slate-700">Difficulty: {problem.difficulty}</p>
          </div>
          <Link to="/problems" className="text-teal-500 hover:underline text-sm">
            ← Back
          </Link>
        </div>

        <div className="border border-slate-300 rounded-md p-4 bg-white shadow-lg overflow-y-auto flex-grow">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
              table: ({ node, ...props }) => <table className="w-full my-3 border-collapse text-sm" {...props} />,
              th: ({ node, ...props }) => <th className="border border-slate-300 px-2 py-1 bg-slate-100 font-semibold text-left" {...props} />,
              td: ({ node, ...props }) => <td className="border border-slate-300 px-2 py-1" {...props} />,
              code: ({ node, ...props }) => <code className="bg-slate-100 text-teal-700 p-1 rounded text-sm font-mono" {...props} />
          }}>
            {markdown}
          </ReactMarkdown>
        </div>
      </div>

      {/* --- RIGHT COLUMN: Editor & Output --- */}
      <div className="flex-1 flex flex-col gap-4 md:h-full overflow-hidden">
        
        {/* Top Half: SQL Editor */}
        <div className="flex-1 bg-white border border-slate-300 rounded-md p-4 shadow-lg flex flex-col min-h-[300px]">
          <h2 className="text-lg font-semibold mb-2 text-slate-900">SQL Editor</h2>
          <textarea
            className="flex-grow w-full border border-slate-300 rounded-md p-2 font-mono text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none bg-gray-50"
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            placeholder="SELECT * FROM ..."
          />
          <button
            onClick={handleRun}
            className="mt-3 px-6 py-2 rounded-lg bg-orange-500 text-white text-base font-semibold transition hover:bg-orange-600 shadow-md hover:shadow-lg transform hover:scale-[1.01]"
          >
            Run Code
          </button>
        </div>

        {/* Bottom Half: User Output Table */}
        <div className="flex-1 bg-white border border-slate-300 rounded-md p-4 shadow-lg flex flex-col overflow-hidden min-h-[200px]">
          <h2 className="text-lg font-semibold mb-2 text-slate-900">Query Output</h2>
          
          <div className="flex-grow overflow-auto border border-slate-200 rounded bg-slate-50">
            {!userOutput ? (
              <div className="h-full flex items-center justify-center text-slate-400 italic">
                Run query to see results...
              </div>
            ) : Array.isArray(userOutput) && userOutput.length > 0 ? (
              <table className="w-full text-sm text-left text-slate-700 border-collapse">
                <thead className="text-xs text-slate-700 uppercase bg-gray-100 sticky top-0">
                  <tr>
                    {/* Dynamically generate headers from the first object keys */}
                    {Object.keys(userOutput[0]).map((key) => (
                      <th key={key} className="px-4 py-2 border-b border-slate-300 font-semibold">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Map through data rows */}
                  {userOutput.map((row, i) => (
                    <tr key={i} className="bg-white border-b hover:bg-blue-50">
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="px-4 py-2 border-b border-slate-200 whitespace-nowrap font-mono text-xs">
                          {/* Use String() to safely convert unknown types to string, handling nulls manually */}
                          {val === null || val === undefined ? 'NULL' : String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-4 text-slate-500 font-mono text-sm">
                {/* Handle Empty Array or Error Message String */}
                {Array.isArray(userOutput) ? "Query returned 0 rows." : JSON.stringify(userOutput, null, 2)}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};