import { Link } from "react-router-dom";
import Form from "../components/AuthForm";

const Register = () => {

      return (
            <div>
                  <Form/>
                  <h3>
                        New to MyStore? 
                        <Link to="/auth/register" className="inline-block ml-2 text-red-500">
                              <h4>Register</h4>
                        </Link>
                  </h3>
                  <form method="POST" action="http://localhost:5000/auth/google" >
                        <button type="submit">Sign in With Google</button>
                  </form>      
            </div>
      )
}

export default Register;