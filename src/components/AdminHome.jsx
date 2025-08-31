import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { authActions } from "../redux/authSlice";
import {FaTrashAlt} from 'react-icons/fa';
const AdminHome = () => {
  const { allusers } = useSelector((state) => state.author);
    const dispatch = useDispatch();
    const BACKEND_URL = import.meta.env.VITE_BACKEND||'http://localhost:8000';
  useEffect(() => {

      toast.success(`Welcome back Admin`, {
        position: "bottom-right",
      });
  }, []);
  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/excel/user/all`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(authActions.setUsers(res.data.users));
      } else {
        toast.error("Failed to load user data.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while fetching users.");
    }
  };
    const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await axios.delete(`${BACKEND_URL}/api/excel/user/${userId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(authActions.setUsers(res.data.newUsers));
        toast.success(res.data.message);
        fetchAllUsers(); 
        
      } else {
        toast.error("Failed to delete user.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while deleting user.");
    }
  };
  useEffect(() => {
    fetchAllUsers();
  }, [dispatch]);
  return (
     <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center p-4 sm:p-6">
       <div className="bg-gray-800 shadow-2xl shadow-purple-500/10 rounded-2xl p-6 sm:p-10 w-full max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent mb-2 animate-gradient">
              Admin Home Page
            </h1>
            <p className="text-gray-400 text-lg">
              Manage all user uploads and system analytics in one place.
            </p>
          </div>
           <button 
            onClick={fetchAllUsers}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 1-9 9c-4.97 0-9-4.03-9-9s4.03-9 9-9c2.49 0 4.74.99 6.35 2.65M21 6v6h-6"/></svg>
            Refresh
          </button>
        </div>

        {/* User Data Table */}
        <div className="overflow-x-auto mb-12">
          {allusers && allusers.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-4 text-left font-semibold text-gray-300">Username</th>
                  <th className="p-4 text-left font-semibold text-gray-300">Email</th>
                  <th className="p-4 text-left font-semibold text-gray-300">Role</th>
                  <th className="p-4 text-left font-semibold text-gray-300">File Name</th>
                  <th className="p-4 text-left font-semibold text-gray-300">Charts</th>
                </tr>
              </thead>
              <tbody>
                {allusers.map((upload, index) => (
                  <tr key={upload._id || index} className="hover:bg-gray-700/50 transition-colors duration-200 border-b border-gray-800">
                    <td className="p-4 whitespace-nowrap">{upload?.user?.username || 'N/A'}</td>
                    <td className="p-4 whitespace-nowrap">{upload?.user?.email || 'N/A'}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${upload?.user?.role=='admin' ? "bg-purple-500/20 text-purple-300" : "bg-blue-500/20 text-blue-300"}`}>
                        {upload?.user?.role=='admin' ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">{upload.originalName || 'N/A'}</td>
                    <td className="p-4 whitespace-nowrap">
                      {Array.isArray(upload.charts) && upload.charts.length > 0
                        ? upload.charts.map(c => c.chartType).join(", ")
                        : "None"}
                    </td>
                     <td className="p-4 whitespace-nowrap">
                      <button
                        onClick={() => deleteUser(upload?.user?._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
                      >
                       <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-xl">No user data found.</p>
            </div>
          )}
        </div>
        </div>
     </div>
 
  )
}

export default AdminHome
