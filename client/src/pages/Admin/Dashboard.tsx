import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const Dashboard = () => {
    const location = useLocation();
    const [ path, setPath ] = useState(location.pathname.split("/").pop());

    useEffect(() => {
        const currentPath = location.pathname.split("/").pop();
        setPath(currentPath);
    }, [location])

    return (
        <div className="flex">
             <div className="w-64 h-screen bg-gray-100 p-4">
                <nav className="space-y-2">
                    <Link to="/admin/dashboard/" className={`${path === "" && "text-white bg-blue-500"} block py-2 px-4 hover:bg-gray-200 rounded`}>Overview</Link>
                    <Link to="/admin/dashboard/products" className={`${path === "products" && "text-white bg-blue-500"} block py-2 px-4 hover:bg-gray-200 rounded`}>ManageProducts</Link>
                    <Link to="/admin/dashboard/orders" className={`${path === "orders" && "text-white bg-blue-500"} block py-2 px-4 hover:bg-gray-200 rounded`}>ManageOrders</Link>
                    <Link to="/admin/dashboard/users" className={`${path === "users" && "text-white bg-blue-500"} block py-2 px-4 hover:bg-gray-200 rounded`}>ManageUsers</Link>
                </nav>
            </div>
            <section className="flex-1 container mx-auto py-8 px-4 flex gap-8">
                <Outlet />
            </section>
        </div>
    )
}

export default Dashboard;