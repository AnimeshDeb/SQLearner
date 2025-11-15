import { useNavigate } from "react-router-dom";
import { type MouseEvent, useEffect } from "react";

// --- SVG Icons (no changes) ---

// Replaces BsTerminal
function IconTerminal({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

// Replaces BsGraphUp
function IconGraphUp({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

// Replaces BsPeople
function IconPeople({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

// Replaces BsArrowRight
function IconArrowRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      // Use provided className or default to matching text size (1.25rem)
      className={className || "w-5 h-5"}
    >
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.28a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// Replaces BsFillStarFill (Complete path)
function IconStarFill({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      // Use provided className or default to matching text size (1rem)
      className={className || "w-4 h-4"}
    >
      <path
        fillRule="evenodd"
        d="M10.868 2.884c-.321-.662-1.215-.662-1.536 0l-1.954 4.041-4.45 1.023a.75.75 0 00-.416 1.279l3.218 3.137-1.306 4.71a.75.75 0 001.088.791L10 14.347l4.182 2.198a.75.75 0 001.088-.79l-1.306-4.71 3.218-3.137a.75.75 0 00-.416-1.28l-4.45-1.023L10.868 2.884z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// 1. Navigation Bar - Glassmorphism
function Navbar() {
  const navigate = useNavigate();

  const handleScroll = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("problems-preview");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-white/70 backdrop-blur-lg z-50 px-6 py-4 border-b border-white/30">
      <div className="container mx-auto flex justify-between items-center">
        {/* UPDATED: Teal-500 for brand */}
        <h1 className="text-2xl font-bold text-teal-500">SQL-Up</h1>
        <div className="flex items-center gap-4">
          <a
            href="#problems-preview"
            onClick={handleScroll}
            className="text-slate-600 hover:text-teal-500 transition"
          >
            Problems
          </a>
          <button
            onClick={() => navigate("/signin")}
            className="cursor-pointer px-4 py-2 text-slate-800 rounded-lg hover:bg-slate-200 transition"
          >
            Sign In
          </button>
          {/* UPDATED: Orange-500 for "excited" CTA */}
          <button
            onClick={() => navigate("/signup")}
            className="cursor-pointer px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}

// 2. Hero Section
function HeroSection() {
  const navigate = useNavigate();

  const handleScroll = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("problems-preview");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center pt-16">
      <h1 className="text-5xl font-extrabold mb-4 text-slate-900">
        Learn SQL the <span className="text-teal-500">Fun Way</span>
      </h1>
      <p className="text-lg text-slate-600 max-w-xl mb-8">
        Practice SQL problems, run real queries, earn XP, climb leaderboards,
        and share solutions. Everything you need to level up your SQL skills,
        from beginner to pro.
      </p>
      <div className="flex gap-4">
        {/* UPDATED: Teal for secondary action */}
        <a
          href="#problems-preview"
          onClick={handleScroll}
          className="flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition text-lg font-medium"
        >
          View Problems
        </a>
        {/* UPDATED: Orange ghost button for primary action */}
        <button
          onClick={() => navigate("/signup")}
          className="cursor-pointer px-6 py-3 border border-orange-500 rounded-lg text-orange-500 hover:bg-orange-500 hover:text-white transition text-lg font-medium"
        >
          Sign Up Now
        </button>
      </div>
    </div>
  );
}

// 3. Features Section
function FeaturesSection() {
  const features = [
    {
      icon: <IconTerminal className="text-teal-500" />,
      title: "Interactive Editor",
      description:
        "Run real SQL queries directly in your browser. No setup required. Get instant feedback on your code.",
    },
    {
      icon: <IconGraphUp className="text-teal-500" />,
      title: "Earn XP & Level Up",
      description:
        "Stay motivated by gaining experience points for every problem you solve. Watch your level climb as you learn.",
    },
    {
      icon: <IconPeople className="text-teal-500" />,
      title: "Climb the Leaderboard",
      description:
        "See how you stack up against other learners. Compete for the top spot and share your solutions with the community.",
    },
  ];

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12 text-slate-900">
          Everything You Need to Master SQL
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature) => (
            <div
              key={feature.title}
              // Glassmorphism for cards
              className="bg-white/70 backdrop-blur-lg p-8 rounded-xl shadow-lg border border-white/30"
            >
              {/* UPDATED: Teal icon background */}
              <div className="flex items-center justify-center h-16 w-16 bg-teal-100 rounded-full mx-auto mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-slate-900">
                {feature.title}
              </h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 4. Problem Preview Section
function ProblemPreview() {
  const navigate = useNavigate();

  return (
    // UPDATED: bg-white for "airy" content block
    <section id="problems-preview" className="py-20 bg-white relative z-10 shadow-xl">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
          Learn by Doing, Not Just Reading
        </h2>

        <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden border border-slate-200 lg:flex">
          {/* Left Side: Description & Schema */}
          <div className="lg:w-1/2 p-8">
            <h3 className="text-2xl font-semibold mb-4 text-slate-900">
              Find Duplicate Emails
            </h3>
            {/* UPDATED: Teal tag */}
            <span className="inline-block bg-teal-100 text-teal-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Easy
            </span>
            <p className="text-slate-700 mb-6">
              Write a SQL query to find all duplicate emails in a table named{" "}
              <code className="bg-slate-200 px-1 rounded text-slate-800">
                Person
              </code>
              .
            </p>
            <h4 className="font-semibold text-lg mb-2 text-slate-900">
              Schema:
            </h4>
            <div className="p-4 border rounded-md bg-slate-100 border-slate-200">
              <p className="font-mono text-sm">
                <strong className="text-slate-800">Table: Person</strong>
              </p>
              <ul className="list-disc list-inside font-mono text-sm text-slate-600">
                <li>Id (int, PK)</li>
                <li>Email (varchar)</li>
              </ul>
            </div>
          </div>

          {/* Right Side: Mock Editor & Output */}
          <div className="lg:w-1/2 bg-slate-900 p-8 text-white font-mono">
            <p className="text-slate-400 text-sm">// Your SQL Query</p>
            <pre className="text-slate-100 mb-4">
              {/* UPDATED: Teal and Amber for syntax */}
              <span className="text-teal-400">SELECT</span> Email
              <br />
              <span className="text-teal-400">FROM</span> Person
              <br />
              <span className="text-teal-400">GROUP BY</span> Email
              <br />
              <span className="text-teal-400">HAVING</span>{" "}
              <span className="text-amber-400">COUNT</span>(Email) {">"} 1;
            </pre>
            {/* UPDATED: Teal "Run" button */}
            <button className="cursor-pointer px-5 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition mb-4 font-semibold">
              Run Query
            </button>
            <p className="text-slate-400 text-sm">// Output</p>
            <div className="p-4 bg-slate-800 rounded">
              <p>{"{"} "Email": "a@b.com" {"}"}</p>
              <p>{"{"} "Email": "c@d.com" {"}"}</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          {/* UPDATED: Teal button */}
          <button
            onClick={() => navigate("/problems")}
            className="cursor-pointer flex items-center gap-2 mx-auto px-8 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition text-xl font-medium"
          >
            Explore All Problems
            <IconArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}

// 5. Leaderboard Preview Section
function LeaderboardPreview() {
  const topLearners = [
    { rank: 1, name: "DataWizard", xp: 1250 },
    { rank: 2, name: "SQL_Ninja", xp: 1100 },
    { rank: 3, name: "QueryQueen", xp: 980 },
  ];

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12 text-slate-900">
          Join Our Top Learners
        </h2>
        <div className="max-w-md mx-auto bg-white/70 backdrop-blur-lg rounded-xl shadow-lg border border-white/30 p-6">
          {topLearners.map((user) => (
            <div
              key={user.rank}
              className="flex items-center justify-between p-4 border-b border-slate-200 last:border-b-0"
            >
              <div className="flex items-center gap-4">
                <span className="font-bold text-lg text-slate-700">
                  {user.rank}.
                </span>
                <span className="font-semibold text-slate-900">
                  {user.name}
                </span>
              </div>
              {/* UPDATED: Amber for XP */}
              <span className="font-bold text-amber-500 flex items-center gap-1">
                {user.xp} XP
                {user.rank === 1 && (
                  <IconStarFill className="text-amber-500 w-5 h-5" />
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 6. Final Call-to-Action Section
function FinalCTA() {
  const navigate = useNavigate();
  return (
    // UPDATED: Orange for "excited" CTA
    <section className="py-24 bg-orange-500 text-white relative z-10">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold mb-6">
          Ready to Level Up Your SQL Skills?
        </h2>
        <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
          Start for free, solve your first problem in minutes, and join a
          community of learners.
        </p>
        <button
          onClick={() => navigate("/signup")}
          className="cursor-pointer flex items-center gap-2 mx-auto px-10 py-4 bg-white text-orange-500 rounded-lg hover:bg-orange-50 transition text-xl font-bold"
        >
          Start Learning Now
          <IconArrowRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}

// 7. Footer
function Footer() {
  return (
    <footer className="py-8 bg-slate-900 text-slate-400 relative z-10">
      <div className="container mx-auto px-6 text-center">
        <p>&copy; {new Date().getFullYear()} SQL-Up. All rights reserved.</p>
      </div>
    </footer>
  );
}

// --- Main Landing Page Component ---
export default function Landing() {
  useEffect(() => {
    const originalColor = document.body.style.backgroundColor;
    // UPDATED: "Airy" background color
    document.body.style.backgroundColor = "#f8fafc"; // slate-50

    return () => {
      document.body.style.backgroundColor = originalColor;
    };
  }, []);

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      {/* Decorative background gradient blobs */}
      <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-orange-400 to-teal-400 opacity-20 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <ProblemPreview />
      <LeaderboardPreview />
      <FinalCTA />
      <Footer />
    </div>
  );
}