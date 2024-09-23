import { FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as UserServices from "../services/User.service";
import { useUser } from "../context/UserContextProvider";
import { AuthResponse, authType } from "../types/types";

interface FormProps {
      authType: authType;
}

const Form = ({ authType }: FormProps) => {
      const name = useRef<HTMLInputElement>(null);
      const email = useRef<HTMLInputElement>(null);
      const password = useRef<HTMLInputElement>(null);
      const [error, setError] = useState<string>('');
      const { setIsLoggedIn, setUser } = useUser();
      const navigate = useNavigate();

      const handleResponse = (response: AuthResponse): boolean => {
            if (response.message === "Email not found") {
                  setError('emailNotFound')
                  return false;
            } else if (response.message === "Incorrect Password") {
                  setError('incorrectPassword')
                  return false;
            }
            return true;
      }

      const handleSubmit = async (e: FormEvent) => {
            e.preventDefault();
            if (!email.current || !password.current || (authType !== "login" && !name.current)) {
                  return;
            }
            const data = {
                  name: name.current ? name.current.value : '',
                  email: email.current.value,
                  enterPassword: password.current.value
            }

            const isAuthenticate = await UserServices.authenticateUser({data, authType, handleResponse});
            if (isAuthenticate) {
                  console.log(isAuthenticate)
                  setIsLoggedIn(true);
                  UserServices.getCurrentUser().then(data => setUser(data));
                  navigate('/');
            }
      }

      return (
            <form className="p-4 shadow-md rounded my-4" onSubmit={handleSubmit}>
                  { authType === "login" ? 
                        <h2 className="mb-4">Login Your Account</h2> : 
                        <h2 className="mb-4">Register</h2>
                              
                  }
                  <div className={`flex items-center gap-3 ${authType === 'login' && 'hidden'}`}>
                        <label htmlFor="name" className="w-24">Name</label>
                        <input ref={name} type="text" id="name" placeholder="Jhon Smith" className="outline-none border-b-2 border-gray-600 rounded p-2 mb-2" />
                  </div>
                  <div className="flex items-center gap-3">
                        <label htmlFor="email" className="w-24">Email</label>
                        <input ref={email} type="text" id="email" placeholder="example@gmail.com" className="outline-none border-b-2 border-gray-600 rounded p-2 mb-2" />
                        { error === "emailNotFound" && <span className="text-red-500">Email Not Found</span> }
                  </div>
                  <div className="flex items-center gap-3">
                        <label htmlFor="password" className="w-24">Password</label>
                        <input ref={password} type="password" id="password" placeholder="...." className="outline-none border-b-2 border-gray-600 rounded p-2 mb-2" />
                        { error === "incorrectPassword" && <span className="text-red-500">Password is Incorrect!</span> }
                  </div>
                  <button type="submit" className="border-2 border-purple-800 rounded py-1 px-2 mt-4">
                        { authType === "login" ? 
                              <span>Login</span> : 
                              <span>Register</span>
                        }
                  </button>
            </form>
      );
}

export default Form;
