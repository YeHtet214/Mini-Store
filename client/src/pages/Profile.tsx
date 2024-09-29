import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContextProvider";

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
            <div>
                  <h3>{currentUser?.name}</h3>
                  <em>{currentUser?.email}</em>
                  <button className="border-b-2 py-2 px-4 rounded text-purple-500 float-right" onClick={logoutHandler}>Logout</button>
            </div>
      );
}

export default Profile;
