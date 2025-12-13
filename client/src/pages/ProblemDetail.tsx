import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useUser } from '@clerk/clerk-react';

export interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  slug: string;
  hints: string[];
  correctQuery: string; // Added field
}

const API_BASE_URL = 'http://localhost:3000/api/problems';

export const ProblemDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isSignedIn } = useUser();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Input State
  const [sql, setSql] = useState('');
  const [isSqlLoaded, setIsSqlLoaded] = useState(false); 

  // Execution State
  const [userOutput, setUserOutput] = useState<Record<string, unknown>[][] | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [execError, setExecError] = useState<string | null>(null);

  // Hint & Solution State
  const [revealedHints, setRevealedHints] = useState(0);
  const [showSolution, setShowSolution] = useState(false); // New state for solution toggle

  // --- Persistence Logic ---
  useEffect(() => {
    if (!slug) return;
    setIsSqlLoaded(false);
    const savedSql = localStorage.getItem(`sqlearner_sql_${slug}`);
    if (savedSql !== null) {
        setSql(savedSql);
    } else {
        setSql('');
    }
    setIsSqlLoaded(true);
  }, [slug]);

  useEffect(() => {
    if (slug && isSqlLoaded) {
        localStorage.setItem(`sqlearner_sql_${slug}`, sql);
    }
  }, [sql, slug, isSqlLoaded]);

  useEffect(() => {
    setUserOutput(null);
    setIsCorrect(null);
    setShowModal(false);
    setShowAuthModal(false);
    setExecError(null);
    setRevealedHints(0);
    setShowSolution(false); // Reset solution visibility on problem change

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
        setError(e instanceof Error ? e.message : 'Failed to fetch problem detail.');
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [slug]);

  // --- Handlers ---

  const handleSubmit = async () => {
    if (!isSignedIn) {
      setShowAuthModal(true);
      return;
    }

    setExecError(null);
    
    try {
      const response = await fetch('http://localhost:3000/sqlrun', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql, slug }),
      });
      
      const data = await response.json();
      
      if (data.status === 'error' || data.status === 'system_error') {
        setExecError(data.message);
        setIsCorrect(false);
        setShowModal(true);
      } else {
        setUserOutput(data.userOutput);
        setIsCorrect(data.isCorrect);
        setShowModal(true);
      }

    } catch (e) {
      console.error("Run error:", e);
      alert("Failed to connect to the execution server.");
    }
  };

  const handleRun = async () => {
    if (!isSignedIn) {
      setShowAuthModal(true);
      return;
    }

    setExecError(null);

    try {
      const response = await fetch('http://localhost:3000/sqlrun', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql, slug }),
      });
      
      const data = await response.json();
      
      if (data.status === 'error' || data.status === 'system_error') {
        setExecError(data.message);
      } else {
        setUserOutput(data.userOutput);
      }

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
      
      {/* --- AUTH MODAL --- */}
      {showAuthModal && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center border-t-8 border-blue-500">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-6">
              You need to be signed in to run code.
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setShowAuthModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <Link 
                to={`/signin?redirect_url=${encodeURIComponent(`/problems/${slug}`)}`}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-md"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* --- RESULT MODAL --- */}
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
                <p className="text-gray-600 mb-6">
                  {execError ? "SQL Error occurred." : "Your output didn't match the expected result. Check your logic."}
                </p>
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

      {/* --- LEFT COLUMN: Description, Hints & Solution --- */}
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

          {/* Hints Section */}
          {problem.hints && problem.hints.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-yellow-800 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <span>💡</span> Hints ({revealedHints} / {problem.hints.length})
                  </h3>
                  {revealedHints < problem.hints.length && (
                    <button 
                      onClick={() => setRevealedHints(prev => prev + 1)}
                      className="cursor-pointer text-xs bg-yellow-200 hover:bg-yellow-300 text-yellow-900 px-3 py-1 rounded-full font-semibold transition-colors border border-yellow-300"
                    >
                      Show Next Hint
                    </button>
                  )}
                </div>
                
                <div className="space-y-3">
                  {revealedHints === 0 && (
                    <p className="text-sm text-yellow-700 italic">Stuck? Reveal a hint to get moving.</p>
                  )}
                  
                  {problem.hints.map((hint, index) => (
                    index < revealedHints ? (
                      <div key={index} className="text-sm text-slate-800 bg-white p-3 rounded-md border border-yellow-100 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                        <span className="font-bold text-yellow-600 block text-xs mb-1">HINT {index + 1}</span>
                        {hint}
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Solution Section */}
          <div className="mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-blue-800 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <span>🔓</span> Solution
                </h3>
                <button 
                  onClick={() => setShowSolution(!showSolution)}
                  className="cursor-pointer text-xs bg-blue-200 hover:bg-blue-300 text-blue-900 px-3 py-1 rounded-full font-semibold transition-colors border border-blue-300"
                >
                  {showSolution ? 'Hide Solution' : 'Show Solution'}
                </button>
              </div>

              {showSolution && (
                 <div className="text-sm text-slate-800 bg-white p-3 rounded-md border border-blue-100 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    <span className="font-bold text-blue-600 block text-xs mb-1">CORRECT QUERY</span>
                    <pre className="font-mono text-xs overflow-x-auto whitespace-pre-wrap text-teal-700">
                      {problem.correctQuery}
                    </pre>
                 </div>
              )}
            </div>
          </div>

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
          <div className="flex gap-2 mt-3">
            <button
                onClick={handleRun}
                className="cursor-pointer px-6 py-2 rounded-lg bg-orange-500 text-white text-base font-semibold transition hover:bg-orange-600 shadow-md hover:shadow-lg transform hover:scale-[1.01]"
            >
                Run Code
            </button>
            <button
                onClick={handleSubmit}
                className="cursor-pointer px-6 py-2 rounded-lg bg-blue-600 text-white text-base font-semibold transition hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:scale-[1.01]"
            >
                Submit Code
            </button>
          </div>
        </div>

        {/* Bottom Half: User Output Table */}
        <div className="flex-1 bg-white border border-slate-300 rounded-md p-4 shadow-lg flex flex-col overflow-hidden min-h-[200px]">
          <h2 className="text-lg font-semibold mb-2 text-slate-900">Query Output</h2>
          
          <div className="flex-grow overflow-auto border border-slate-200 rounded bg-slate-50 p-2 space-y-6">
            
            {execError && <div className="text-red-600 font-mono text-sm p-2 bg-red-50 rounded border border-red-200">{execError}</div>}

            {!userOutput && !execError && (
              <div className="h-full flex items-center justify-center text-slate-400 italic">Run query to see results...</div>
            )}

            {/* Loop through Array of Result Sets */}
            {userOutput && userOutput.map((resultSet, index) => (
              <div key={index} className="mb-4">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Result Set {index + 1}</div>
                {Array.isArray(resultSet) && resultSet.length > 0 ? (
                  <table className="w-full text-sm text-left text-slate-700 border-collapse border border-slate-300">
                    <thead className="text-xs text-slate-700 uppercase bg-gray-100">
                      <tr>
                        {Object.keys(resultSet[0]).map((key) => (
                          <th key={key} className="px-4 py-2 border-b border-slate-300 font-semibold">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {resultSet.map((row: Record<string, unknown>, i: number) => (
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
                  <div className="p-2 text-slate-500 text-sm border border-dashed border-slate-300 rounded bg-white">
                    {Array.isArray(resultSet) ? "Empty set (0 rows)" : JSON.stringify(resultSet)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};