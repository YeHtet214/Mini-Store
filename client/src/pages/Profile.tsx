import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContextProvider";
import { Edit, LogOut, Mail, MapPin, Phone, ShoppingCart, User } from "lucide-react";

const Profile = () => {
      const { currentUser, setIsLoggedIn } = useUser();
      const navigate = useNavigate();

      const logoutHandler = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
            setIsLoggedIn(false);
            navigate("/auth/login");
      }

      const user = {
            name: 'May Zin',
            email: 'zoo@gmail.com',
            avatar: '/placeholder.svg?height=100&width=100',
            phone: '+1 (555) 123-4567',
            address: '123 Main St, Anytown, USA'
          }
      
      return (
            // <div className="container md:max-w-md mx-auto py-8 bg-white">
            //       <h3 className="grid gird-cols-2 grid-flow-col"><span>User Name: </span><span>{currentUser?.name}</span></h3>
            //       <h3 className="grid gird-cols-2 grid-flow-col"><span>Email: </span><span>{currentUser?.email}</span></h3>
            //       <button
            //             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-100 bg-indigo-500 hover:text-indigo-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            //             onClick={logoutHandler}
            //       >
            //             Logout
            //       </button>
            // </div>
            <div className="min-h-screen bg-gray-100">
                  <main className="container mx-auto py-6 sm:px-6 lg:px-8">
                        <div className="px-4 py-6 sm:px-0">
                              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                                          <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
                                          <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                          <Edit className="h-4 w-4 mr-2" />
                                          Edit Profile
                                          </button>
                                    </div>
                                    <div className="border-t border-gray-200">
                                          <dl>
                                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                                                            <User className="h-5 w-5 mr-2 text-gray-400" />
                                                            Full name
                                                      </dt>
                                                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.name}</dd>
                                                </div>
                                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                                                            <Mail className="h-5 w-5 mr-2 text-gray-400" />
                                                            Email address
                                                      </dt>
                                                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                                                </div>
                                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                                                            <Phone className="h-5 w-5 mr-2 text-gray-400" />
                                                            Phone number
                                                      </dt>
                                                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.phone}</dd>
                                                </div>
                                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                                                            <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                                                            Address
                                                      </dt>
                                                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.address}</dd>
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
