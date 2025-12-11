import { SignUp } from "@clerk/clerk-react"
import { useSearchParams } from "react-router-dom"
export default function Signup(){
    const [searchParams] = useSearchParams();
    const redirectUrl = searchParams.get('redirect_url') || '/home';

    return(
        <div>
            SIGNUP
            <SignUp
            path="/signup"
            routing="path"
            signInUrl="/signin"
            forceRedirectUrl={redirectUrl}
            
          />
        </div>
    )
}