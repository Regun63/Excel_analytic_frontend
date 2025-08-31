import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { authActions } from '../redux/authSlice';
import logo from '../assets/logo.webp';

const Login = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [input, setInput] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [loginMode, setLoginMode] = useState("user"); 
  const navigate = useNavigate();
  const { users } = useSelector(store => store.author);
    const BACKEND_URL = import.meta.env.VITE_BACKEND||'http://localhost:8000';
  const onChangeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  useEffect(() => {

      toast.success(`Logged Out successfully.`, {
        position: "bottom-right",
      });
  }, []);

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${BACKEND_URL}/api/excel/user/login`,
        { ...input, mode: loginMode }, //  send login mode
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(authActions.setAuthUser(res.data.user));
        const user = res.data.user;

        // Flow after login
        if (!user.verified) {
          navigate("/verify", { state: { message: res.data.message } });
        } 
        else if (user.role === "superadmin") {
          navigate("/superadmin_home", { state: { message: res.data.message } });
        } 
        else if (user.role === "admin") {
          navigate("/admin_home", { state: { message: res.data.message } });
        } 
        else {
          navigate("/userhome", { state: { message: res.data.message } });
        }
      } else {
        toast.info(res.data.message, { position: "bottom-right" });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed", {
        position: "bottom-right",
      });
    } finally {
      setInput({ email: '', password: '' });
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-4 py-8 mx-auto min-h-screen sm:px-6 lg:px-8">
        <div className="w-full max-w-xl bg-white rounded-lg shadow-lg dark:border shadow-cyan-800/50 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 sm:p-8">
            <div className="flex justify-center">
              <img className='h-12 w-12 rounded-full' src={logo} alt="logo" />
            </div>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-center text-gray-900 md:text-2xl dark:text-white">
              {loginMode === "user" ? "Login as User" : "Login as Admin"}
            </h1>

            {/* Toggle Buttons */}
            <div className="flex justify-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => setLoginMode("user")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  loginMode === "user"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setLoginMode("admin")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  loginMode === "admin"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                }`}
              >
                Admin
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={loginHandler} className="space-y-4 md:space-y-6">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-left text-gray-900 dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={onChangeHandler}
                  id="email"
                  placeholder="user@gmail.com"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                             focus:outline-green-400/70 focus:ring-transparent block w-full p-2.5 
                             dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-left text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={input.password}
                  onChange={onChangeHandler}
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                             focus:outline-blue-400/70 focus:ring-transparent block w-full p-2.5 
                             dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 
                           focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm 
                           px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 
                           dark:focus:ring-green-800"
              >
                {loading ? "Loading..." : `Login as ${loginMode}`}
              </button>

              <p className="text-sm font-light text-center text-gray-500 dark:text-gray-400">
                Don't have an account?{" "}
                <NavLink to="/signup" className="font-medium text-green-600 hover:underline dark:text-primary-500">
                  Sign up here
                </NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={3000} />
    </section>
  );
};

export default Login;
