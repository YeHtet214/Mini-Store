import Form from "../components/AuthRegisterForm";
import {Link} from "react-router-dom";

const Register = () => {
      return (
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
                  <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Register New Account</h2>
                  </div>
                  <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                              <Form/>
                              <form className="mt-6" method="POST" action="http://localhost:5000/auth/google">
                                    <button
                                        type="submit"
                                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                                <path
                                                    fill="currentColor"
                                                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                                                />
                                          </svg>
                                          Sign up with Google
                                    </button>
                              </form>

                              <div className="mt-6">
                                    <div className="relative">
                                          <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-300"></div>
                                          </div>
                                          <div className="relative flex justify-center text-sm">
                                                <span
                                                    className="px-2 bg-white text-gray-500">Already have an account?</span>
                                          </div>
                                    </div>

                                    <div className="mt-6">
                                          <Link to="/auth/login">
                                                <button
                                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                      Log In
                                                </button>
                                          </Link>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      );
}

export default Register;
