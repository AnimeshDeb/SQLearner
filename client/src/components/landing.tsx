import { useNavigate } from "react-router-dom"
export default function Landing(){
  
const navigate=useNavigate()
 return(
    <div>
        LANDING PAGE
        <button onClick={() => navigate('/signin')}>Signin</button>
    </div>
 )
}