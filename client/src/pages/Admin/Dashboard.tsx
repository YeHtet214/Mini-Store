import { useEffect, useState } from "react";
import {Link, Outlet, useLocation} from "react-router-dom";
import { FolderKanban, PackageSearch, ShoppingBasket, UserCog } from "lucide-react";

const Dashboard = () => {
    const { pathname } = useLocation();
    const [ path, setPath ] = useState(pathname.split("/").pop());

    useEffect(() => {
        const currentPath = pathname.split("/").pop();
        setPath(currentPath);
    }, [pathname])

    return (
        <div className="flex flex-col md:flex-row h-screen gap-4">
             <div className="bg-white rounded-r-md shadow-lg">
                <nav className="flex items-center justify-between md:flex-col text-left md:w-52">
                    <Link to="/admin/dashboard" className={`${(path === "dashboard") && "text-white bg-indigo-500"} block py-4 px-4 hover:bg-indigo-300 hover:text-white rounded w-full border-b-2 flex items-center justify-between`}>
                      <span>Overview</span>
                      <FolderKanban />
                    </Link>
                    <Link to="/admin/dashboard/products" className={`${path === "products" && "text-white bg-indigo-500"} block py-4 px-4 hover:bg-indigo-300 hover:text-white rounded w-full border-b-2 flex items-center justify-between`}>
                      <span>Products</span>
                      <PackageSearch />
                    </Link>
                    <Link to="/admin/dashboard/orders" className={`${path === "orders" && "text-white bg-indigo-500"} block py-4 px-4 hover:bg-indigo-300 hover:text-white rounded w-full border-b-2 flex items-center justify-between`}>
                      <span>Orders</span>
                      <ShoppingBasket />
                    </Link>
                    <Link to="/admin/dashboard/users" className={`${path === "users" && "text-white bg-indigo-500"} block py-4 px-4 hover:bg-indigo-300 hover:text-white rounded w-full border-b-2 flex items-center justify-between`}>
                      <span>Users</span>
                      <UserCog />
                    </Link>
                </nav>
            </div>
            <section className="flex-1 container p-4 overflow-scroll bg-white rounded-l-md shadow-lg">
                <Outlet />
            </section>
        </div>
    )
}

export default Dashboard;