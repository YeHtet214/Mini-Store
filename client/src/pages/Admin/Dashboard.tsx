import { useEffect, useState } from "react";
import {Link, Outlet, useLocation} from "react-router-dom";

const Dashboard = () => {
    const { pathname } = useLocation();
    const [ path, setPath ] = useState(pathname.split("/").pop());

    useEffect(() => {
        const currentPath = pathname.split("/").pop();
        setPath(currentPath);
    }, [pathname])

    return (
        <div className="flex flex-col md:flex-row h-screen  gap-4">
             <div className="bg-gray-100">
                <nav className="flex items-center justify-between md:flex-col text-left md:w-52">
                    <Link to="/admin/dashboard" className={`${(path === "dashboard") && "text-white bg-indigo-500"} block py-2 px-4 hover:bg-indigo-200 rounded w-full`}>Overview</Link>
                    <Link to="/admin/dashboard/products" className={`${path === "products" && "text-white bg-indigo-500"} block py-2 px-4 hover:bg-indigo-200 rounded w-full`}>Products</Link>
                    <Link to="/admin/dashboard/orders" className={`${path === "orders" && "text-white bg-indigo-500"} block py-2 px-4 hover:bg-indigo-200 rounded w-full`}>Orders</Link>
                    <Link to="/admin/dashboard/users" className={`${path === "users" && "text-white bg-indigo-500"} block py-2 px-4 hover:bg-indigo-200 rounded w-full`}>Users</Link>
                </nav>
            </div>
            <section className="flex-1 container p-4 overflow-scroll">
                <Outlet />
            </section>
        </div>
    )
}

export default Dashboard;