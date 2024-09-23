import { Link, Outlet } from "react-router-dom";

const Dashboard = () => {
    return (
        <div className="flex gap-4 w-full">
            <nav>
                <ul>
                    <li><Link to="/admin/dashboard/">Overview</Link></li>
                    <li><Link to="/admin/dashboard/products">ManageProducts</Link></li>
                    <li><Link to="/admin/dashboard/orders">ManageOrders</Link></li>
                    <li><Link to="/admin/dashboard/users">ManageUsers</Link></li>
                </ul>
            </nav>
            <section className="flex-1">
                <Outlet />
            </section>
        </div>
    )
}

export default Dashboard;