import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as UserServices from "../services/User.service";
import { useUser } from "../context/UserContextProvider";
import { AuthResponse, userInfo } from "../types/types";

const Form = () => {
      const [userInput, setUserInput] = useState<userInfo>({ name: '', email: '', password: ''});
      const [error, setError] = useState<string>('');
      const { setIsLoggedIn, setCurrentUser } = useUser();
      const navigate = useNavigate();

      useEffect(() => {
            console.log(userInput);
      }, [userInput]);

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
            console.log("LOgin data: ", userInput);

            const isAuthenticate = await UserServices.authenticateUser({userInput, handleResponse});
            if (isAuthenticate) {
                  setIsLoggedIn(true);
                  UserServices.getCurrentUser().then(data => setCurrentUser(data));
                  navigate('/');
            }
      }

      const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setUserInput(prev => ({ ...prev, [name]: value }));
      }

      return (
            <form className="p-4 shadow-md rounded my-4" onSubmit={handleSubmit}>
                <h2 className="mb-4">Login Your Account</h2> : 
                  <div className="flex items-center gap-3">
                        <label htmlFor="email" className="w-24">Email</label>
                        <input value={userInput.email} type="text" id="email" name="email" placeholder="example@gmail.com" className="outline-none border-b-2 border-gray-600 rounded p-2 mb-2" required onChange={handleChange} />
                        { error === "emailNotFound" && <span className="text-red-500">Email Not Found</span> }
                  </div>
                  <div className="flex items-center gap-3">
                        <label htmlFor="password" className="w-24">Password</label>
                        <input value={userInput.password} type="password" id="password" name="password" placeholder="...." className="outline-none border-b-2 border-gray-600 rounded p-2 mb-2" required onChange={handleChange} />
                        { error === "incorrectPassword" && <span className="text-red-500">Password is Incorrect!</span> }
                  </div>
                  <button type="submit" className="border-2 border-purple-800 rounded py-1 px-2 mt-4" >Login</button> :
            </form>
      );
}

export default Form;
