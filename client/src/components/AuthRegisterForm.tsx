import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as UserServices from "../services/User.service";
import { useUser } from "../context/UserContextProvider";
import { userInfo } from "../types/types";
import { AlertCircle, Lock, Mail } from "lucide-react";

const Form = () => {
      const [userInput, setUserInput] = useState<userInfo>({ name: '', email: '', password: ''});
      const [error, setError] = useState<string>('');
      const { setIsLoggedIn, setCurrentUser } = useUser();
      const navigate = useNavigate();

      const handleSubmit = async (e: FormEvent) => {
            e.preventDefault();
            const newUser = await UserServices.registerUser(userInput);

            console.log(newUser);

            if (newUser.status && newUser.status === 409) {
                  return setError(newUser.msg);
            } else if (newUser.token && newUser.user_id) {
                  setIsLoggedIn(true);
                  UserServices.getCurrentUser().then(setCurrentUser);
                  localStorage.setItem('token', newUser.token);
                  localStorage.setItem('user_id', newUser.user_id);
                  navigate("/");
            }
      }

      const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setUserInput(prev => ({ ...prev, [name]: value }));
      }

      return (
            <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Jhon Doe"
                                    required
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                    value={userInput.name}
                                    onChange={handleChange}
                              />
                        </div>
                  </div>
                  <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="example@email.com"
                                    required
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                    value={userInput.email}
                                    onChange={handleChange}
                              />
                        </div>
                  </div>

                  <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                    value={userInput.password}
                                    onChange={handleChange}
                              />
                        </div>
                  </div>

                  <div>
                        <button
                              type="submit"
                              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                              Register
                        </button>
                  </div>
                  {error && (
                        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                              <span className="block sm:inline">{error}</span>
                              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                              <AlertCircle className="h-6 w-6 text-red-500" />
                              </span>
                        </div>
                  )}
            </form>
      );
}

export default Form;
