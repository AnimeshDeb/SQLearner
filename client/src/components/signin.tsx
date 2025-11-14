import { SignIn } from "@clerk/clerk-react"
export default function Signin(){
  
return(
    <div>
        SIGN IN NOW
        <SignIn
        path="/signin"
        routing="path"
        signInUrl="/signup"
        forceRedirectUrl="/home"
        />
    </div>
)
}