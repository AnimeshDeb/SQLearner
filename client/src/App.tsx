import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Signin from './components/signin';
import Landing from './components/landing';
import Home from './components/home';
import Signup from './components/signup';
import { ProblemsList } from "./pages/ProblemsList";
import { ProblemDetail } from "./pages/ProblemDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth-related */}
        <Route path="/signin/*" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        {/* Public pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/problems" element={<ProblemsList />} />
        <Route path="/problems/:slug" element={<ProblemDetail />} />

        {/* Protected home */}
        <Route
          path="/home"
          element={
            <>
              <SignedIn>
                <Home />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
