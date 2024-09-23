import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../services/User.service";

const ProfileRoute = () => {
    if (isAuthenticated()) {
        return <Outlet />
    } else {
        return <Navigate to="/auth/login" />
    }
};

export default ProfileRoute;