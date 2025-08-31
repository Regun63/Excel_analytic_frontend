import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/logo.webp";

const SignUp = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
    role: "user", // default role
  });

  const { users } = useSelector((store) => store.author);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
    const BACKEND_URL = import.meta.env.VITE_BACKEND ||'http://localhost:8000';
  const onChangeHandler = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "role" && type === "checkbox") {
      setInput((prev) => ({
        ...prev,
        role: checked ? "admin" : "user",
      }));
    } else {
      setInput((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    if (users) {
      navigate("/userhome");
    }
  }, [users, navigate]);

  const signUpHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${BACKEND_URL}/api/excel/user/signup`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message, {
          position: "bottom-right",
        });

        await axios.post(
          `${BACKEND_URL}/api/excel/user/send-verification-code`,
          {},
          { withCredentials: true }
        );

        navigate("/verify");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "bottom-right",
      });
    } finally {
      setInput({ username: "", email: "", password: "", role: "user" }); // reset role to user
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-4 py-8 mx-auto min-h-screen sm:px-6 lg:px-8">
        <div className="w-full max-w-xl bg-white rounded-lg shadow-lg dark:border shadow-cyan-800/50 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 sm:p-8">
            <div className="flex justify-center">
              <img className="h-12 w-12 rounded-full" src={logo} alt="logo" />
            </div>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-center text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <form onSubmit={signUpHandler} className="space-y-4 md:space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 text-left dark:text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={input.username}
                  onChange={onChangeHandler}
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-blue-400/70 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="username"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-left text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={onChangeHandler}
                  id="email"
                  placeholder="user@gmail.com"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-blue-400/70 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-left text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={input.password}
                  onChange={onChangeHandler}
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-blue-400/70 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="role"
                  checked={input.role === "admin"} // ✅ reflect role
                  onChange={onChangeHandler}
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 accent-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="role" className="px-3 text-blue-900 font-bold">
                  Register as Admin
                </label>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 accent-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="terms"
                    className="font-light text-gray-500 dark:text-gray-300"
                  >
                    I accept the{" "}
                    <a
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      href="#"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              <button
                disabled={loading}
                type="submit"
                className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-500 dark:hover:bg-green-600"
              >
                {loading ? "Loading..." : "Create an account"}
              </button>
              <p className="text-sm font-light text-center text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <NavLink
                  to="/login"
                  className="font-medium text-green-600 hover:underline"
                >
                  Login here
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

export default SignUp;
