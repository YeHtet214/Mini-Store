import Form from "../components/AuthForm";

const Register = () => {
      return (
            <div>
                  <Form authType={"register"}/>
                  <form method="POST" action="http://localhost:5000/auth/google">
                        <button type="submit">Sign up With Google</button>
                  </form>        
            </div>
      );
}

export default Register;
