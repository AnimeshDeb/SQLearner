import { SignUp } from "@clerk/clerk-react"
export default function Signup(){
    return(
        <div>
            SIGNUP
            <SignUp
            path="/signup"
            routing="path"
            signInUrl="/signin"
            forceRedirectUrl="/home"
            
          />
        </div>
    )
}