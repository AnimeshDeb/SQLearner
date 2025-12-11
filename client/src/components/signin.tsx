import { SignIn } from "@clerk/clerk-react";
import { useSearchParams } from "react-router-dom";

export default function Signin() {
  const [searchParams] = useSearchParams();
  
  // 1. Capture the 'redirect_url' param passed from ProblemDetail
  // 2. Fallback to '/home' if no redirect_url is present (e.g., direct navigation)
  const redirectUrl = searchParams.get('redirect_url') || '/home';

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-700 mb-6">Sign In to SQLearner</h2>
        <SignIn
          path="/signin"
          routing="path"
          signUpUrl="/signup" 
          forceRedirectUrl={redirectUrl} // <--- The Fix: Use the dynamic URL here
        />
      </div>
    </div>
  );
}