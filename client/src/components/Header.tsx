import { UserIcon } from "@heroicons/react/24/outline";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContextProvider";
import { useCart } from "../context/CartContextProvider";
import { hasRole } from "../services/User.service";

const Header = () => {
      const { isLoggedIn, currentUser } = useUser();
      const { totalQtyInCart } = useCart();
      const isAdmin = hasRole("admin");

      return (
            <div className="w-full px-7 py-2 mb-4 lg:py-6 lg:px-10 flex gap-6" style={{ boxShadow: "0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1)" }}>
                  <Link to="/" className="flex-1">
                        <h1>MyMarket</h1>
                  </Link>
                  
                  { isAdmin ? 
                  <Link to="/admin/dashboard">Dashboard</Link> :
                  <Link to="/cart" className="">
                        <ShoppingCartIcon className="w-6" />
                        {totalQtyInCart > 0 && <span>{totalQtyInCart}</span>}
                  </Link>}
                  
                  {
                        isLoggedIn ?
                        <Link to="/auth/profile" className="flex gap-2">
                              <UserIcon className="w-6" />
                              <h3>{currentUser?.name}</h3>
                        </Link> :
                        <Link to="/auth/login"><h3>Login</h3></Link>
                  }
            </div>
      )
}

export default Header;

