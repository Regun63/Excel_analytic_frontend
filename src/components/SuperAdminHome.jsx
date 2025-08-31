import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { authActions } from "../redux/authSlice";
import { FaUser, FaUserShield } from "react-icons/fa";

const StatCard = ({ title, value, icon }) => (
  <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 flex items-center gap-4 shadow-md">
    <div className="p-3 bg-gray-700/40 rounded-full">{icon}</div>
    <div>
      <h3 className="text-gray-400 text-sm">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const SuperAdminHome = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const dispatch = useDispatch();
    const BACKEND_URL = import.meta.env.VITE_BACKEND;
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminCount: 0,
  });

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/excel/user/all`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(authActions.setUsers(res.data));
        setAdmins(res.data.admins || []);
        setStats({
          totalUsers: res.data.totalUsers || 0,
          adminCount: res.data.adminCount || 0,
        });
      } else {
        toast.error("Failed to load user data.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred while fetching users."
      );
    }
  };

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BACKEND_URL}/api/excel/superadmin/requests`,
        { withCredentials: true }
      );
      setRequests(response.data.requests);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  }, []);


  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await axios.delete(`${BACKEND_URL}/api/excel/user/${userId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        
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
    fetchRequests();
    fetchAllUsers();
  }, [fetchRequests, dispatch]);

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/excel/superadmin/approve/${id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("User promoted to Admin");
      }
      fetchRequests();
      fetchAllUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Approval failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    setProcessingId(id);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/excel/superadmin/reject/${id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("User Request to admin is rejected");
      }
      fetchRequests();
      fetchAllUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Rejection failed");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen min-w-screen bg-gray-900 text-gray-200 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-gray-800 shadow-2xl shadow-purple-500/10 rounded-2xl p-6 sm:p-10 w-full max-w-6xl">
        
        {/* Header */}
        <h1 className="text-2xl font-bold text-center text-purple-400 mb-8">
          Admin Total Pending Requests:
          <span className="ml-2 text-sm bg-yellow-500 text-white px-2 py-1 rounded-full">
            {requests.length}
          </span>
        </h1>

        {/*  Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<FaUser className="text-blue-400 text-xl" />}
          />
          <StatCard
            title="Admins"
            value={stats.adminCount}
            icon={<FaUserShield className="text-purple-400 text-xl" />}
          />
        </div>

        {/*  Requests Section */}
        <h2 className="text-xl font-semibold text-gray-300 mb-4">Pending Requests</h2>
        {loading ? (
          <p className="text-center text-gray-400">Loading requests...</p>
        ) : requests.length === 0 ? (
          <div className="text-center py-6 text-gray-500">No pending requests</div>
        ) : (
          <div className="bg-gray-800/60 border border-gray-700 rounded-xl shadow-lg overflow-x-auto mb-8">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-700 text-gray-300">
                  <th className="p-3 text-left">SN</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, index) => (
                  <tr
                    key={req?._id}
                    className="border-t border-gray-700 hover:bg-gray-700/30 transition"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{req?.user?.username}</td>
                    <td className="p-3">{req?.user?.email}</td>
                    <td className="p-3 flex justify-center gap-2">
                      <button
                        disabled={processingId === req?.user?._id}
                        onClick={() => handleApprove(req?.user?._id)}
                        className={`px-3 py-1 rounded-lg text-white transition ${
                          processingId === req?.user?._id
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {processingId === req?.user?._id ? "Processing..." : "Approve"}
                      </button>
                      <button
                        disabled={processingId === req?.user?._id}
                        onClick={() => handleReject(req?.user?._id)}
                        className={`px-3 py-1 rounded-lg text-white transition ${
                          processingId === req?.user?._id
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {processingId === req?.user?._id ? "Processing..." : "Reject"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Admins Section */}
        <h2 className="text-xl font-semibold text-gray-300 mb-4">Current Admins</h2>
        {admins.length === 0 ? (
          <div className="text-center py-6 text-gray-500">No admins found.</div>
        ) : (
          <div className="bg-gray-800/60 border border-gray-700 rounded-xl shadow-lg overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-700 text-gray-300">
                  <th className="p-3 text-left">SN</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Manage Admin</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, index) => (
                  <tr
                    key={admin._id}
                    className="border-t border-gray-700 hover:bg-gray-700/30 transition"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{admin.username}</td>
                    <td className="p-3">{admin.email}</td>
                    <td className="p-3">
                       <button
                       onClick={() => deleteUser(admin?._id)}
                       className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
                         > Delete Admin
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminHome;
