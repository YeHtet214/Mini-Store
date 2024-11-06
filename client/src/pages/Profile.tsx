import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContextProvider";
import { Edit, LogOut, Mail, User } from "lucide-react";

const Profile = () => {
      const { currentUser, setIsLoggedIn } = useUser();
      const navigate = useNavigate();

      const logoutHandler = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
            setIsLoggedIn(false);
            navigate("/auth/login");
      }
      
      return (
            <div className="min-h-screen bg-gray-100">
                  <main className="container mx-auto py-6 sm:px-6 lg:px-8">
                        <div className="px-4 py-6 sm:px-0">
                              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                                          <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
                                          {/*<button disabled={true} className="opacity inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">*/}
                                          {/*      <Edit className="h-4 w-4 mr-2" />*/}
                                          {/*      Edit Profile*/}
                                          {/*</button>*/}
                                    </div>
                                    <div className="border-t border-gray-200">
                                          <dl>
                                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                                                            <User className="h-5 w-5 mr-2 text-gray-400" />
                                                            Full name
                                                      </dt>
                                                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{currentUser?.name}</dd>
                                                </div>
                                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                                                            <Mail className="h-5 w-5 mr-2 text-gray-400" />
                                                            Email address
                                                      </dt>
                                                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{currentUser?.email}</dd>
                                                </div>
                                          </dl>
                                    </div>
                              </div>
                              <div className="mt-6">
                                    <button
                                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                          onClick={logoutHandler}
                                          >
                                          <LogOut className="h-5 w-5 mr-2" />
                                          Logout
                                    </button>
                              </div>
                        </div>
                  </main>
          </div>
      );
}

export default Profile;
