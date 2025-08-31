import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {authActions} from '../redux/authSlice'
import { toast } from 'react-toastify';
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { users } = useSelector(store => store.author);
  const dispatch=useDispatch();
    const BACKEND_URL = import.meta.env.VITE_BACKEND||'http://localhost:8000';
  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/excel/user/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(authActions.logout());
        navigate('/login', {
          state: {
            message: res.data.message,
          }
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const onClickHandler = () => {
    navigate('/editprofile');
  };
const homePath =
  users?.role === "admin"
    ? "/admin_home"
    : users?.role === "superadmin"
    ? "/superadmin_home"
    : "/userhome";

const dashboardPath =
  users?.role === "admin"
    ? "/admin_dashboard"
    : "/user_dashboard";


  // Reusable class for nav links for cleaner code
  const navLinkClasses = (path) =>
    `relative px-3 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out group ${
      location.pathname === path
        ? "text-white bg-white/20"
        : "text-gray-300 hover:text-white hover:bg-white/10"
    }`;

  return (
    // A more subtle and professional gradient background
    <nav className="bg-gradient-to-r from-gray-800 via-gray-900 to-black shadow-2xl p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Title with a subtle glow effect */}
        <div className="text-2xl font-bold text-white tracking-wider hover:text-cyan-300 transition-colors duration-300">
          Excel Analysis Platform
        </div>

        <div className="space-x-4 flex justify-around items-center">
          {/* Home Link with underline animation */}
          <Link to={homePath} className={navLinkClasses(homePath)}>
            {users?.role=='admin' ? "Admin Home" : users?.role=='superadmin'?"SuperAdmin Home": "Home"}
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
          </Link>

          {/* Dashboard Link with underline animation */}
          <Link to={dashboardPath} className={navLinkClasses(dashboardPath)}>
            {users?.role=='admin' ? "Admin Dashboard" : users?.role=='superadmin'?"":"Dashboard"}
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
          </Link>

          {/* Edit Profile Button with improved styling */}
          <button
            onClick={onClickHandler}
            className="text-gray-300 hover:text-white px-4 py-2 rounded-md transition-all duration-300 ease-in-out hover:bg-white/10"
          >
            Edit Profile
          </button>

          {/* Logout Button with improved styling */}
          <button
            onClick={logoutHandler}
            className="bg-red-600 text-white px-4 py-2 rounded-md transition-all duration-300 ease-in-out hover:bg-red-700 transform hover:scale-105 shadow-lg hover:shadow-red-500/50"
          >
            Logout
          </button>

          {/* Avatar with hover effect */}
          <div className="group relative">
            <Avatar className="h-10 w-10 rounded-full transition-transform duration-300 group-hover:scale-110 cursor-pointer">
              <AvatarImage
                src={users?.profilePicture.url}
                alt="Profile_Image"
                className="object-cover h-10 w-10 rounded-full border-2 border-transparent group-hover:border-cyan-400 transition-all duration-300"
              />
              <AvatarFallback
                className="flex justify-center items-center text-black font-bold text-lg"
                style={{
                  backgroundColor: "white",
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  border: "2px solid #0891b2", // cyan-600
                }}
              >
                {users?.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
