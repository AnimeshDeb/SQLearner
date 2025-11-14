import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Signin from './components/signin';
import Landing from './components/landing';
import Home from './components/home';
import Signup from './components/signup';
function App() {
  

  return (
    <BrowserRouter>
      <Routes>

      <Route path="/signin/*" element={<Signin />} />
      <Route path="/" element={<Landing />}/>
      <Route path="/signup" element={<Signup />}/>


       <Route
        path="/home"
        element={
          <>
          <SignedIn>
            <Home />
          </SignedIn>
          <SignedOut>
          <RedirectToSignIn/>
          </SignedOut>
          </>
        }
      />
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;