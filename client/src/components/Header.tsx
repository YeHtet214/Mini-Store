import { Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContextProvider";
import { useCart } from "../context/CartContextProvider";
import { hasRole } from "../services/User.service";
import { ChartLine, ShoppingCart, User } from "lucide-react";
import { useEffect, useState } from "react";

const Header = () => {
      const { isLoggedIn, currentUser } = useUser();
      const { totalQtyInCart } = useCart();
      const { pathname } = useLocation();
      const [ activeLink, setActiveLink ] = useState<string>("");
      const isAdmin = hasRole("admin");

      useEffect(() => {
            if (pathname.includes("dashboard")) {
                  setActiveLink("dashboard");
            } else if (pathname.includes("cart")) {
                  setActiveLink("cart");
            } else if (pathname.includes("profile")) {
                  setActiveLink("profile");
            } else {
                  setActiveLink("");
            }
      }, [pathname]);

      return (
            <header className="bg-white shadow">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 gap-6 flex justify-between items-center">
                  <Link to="/" className="flex-grow flex items-center">
                        <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span className="ml-2 text-xl font-semibold text-gray-900">Store</span>
                  </Link>

                  { isAdmin && (
                        <div className="flex items-center">
                              <Link to="/admin/dashboard" className={`ml-4 text-sm font-medium text-gray-700 ${activeLink === "dashboard" && "text-indigo-500"}`}><ChartLine /></Link>
                        </div>
                  )}
                  
                  { isLoggedIn ? (
                        <div className="flex items-center gap-4">

                              { !isAdmin && (
                                    <Link to="/cart" className={`p-1 relative rounded-full text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${activeLink === "cart" && "text-indigo-500"}`}>
                                          <span className="sr-only">View cart</span>
                                              <>
                                                    <ShoppingCart className="h-6 w-6" />
                                                    <span className="absolute -top-2 -left-2">{totalQtyInCart}</span>
                                              </>
                                    </Link>
                              )}

                              <Link to="/auth/profile" className={`flex grow ml-4 text-sm font-medium text-gray-700 relative ${activeLink === "profile" && "text-indigo-500"}`}>
                                    <User />
                                    <span className="absolute -top-4 right-0 text-nowrap">{currentUser?.name}</span>
                              </Link>
                        </div>
                  ) :   <Link 
                              to="/auth/login" 
                              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-100 bg-indigo-500 hover:text-indigo-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                              Login
                        </Link>
                  }
                
              </div>
            </header>
      )
}

export default Header;

