import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { authActions } from "../redux/authSlice";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,LineChart, Line 
} from "recharts";

const CHART_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28"];

const StatCard = ({ title, value, icon }) => (
  <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 flex items-center gap-4 shadow-md">
    <div className="p-3 bg-gray-700/40 rounded-full">{icon}</div>
    <div>
      <h3 className="text-gray-400 text-sm">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminCount: 0,
    filesUploaded: 0,
  });
    const BACKEND_URL = import.meta.env.VITE_BACKEND||'http://localhost:8000';
  const [uploads, setUploads] = useState([]); // store uploaded files separately

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/excel/user/all`, {
        withCredentials: true,
      });

      if (res.data.success) {
        // Store all users in redux
        dispatch(authActions.setUsers(res.data));

        // Update stats
        setStats({
          totalUsers: res.data.totalUsers || 0,
          adminCount: res.data.adminCount || 0,
          filesUploaded: res.data.users?.length || 0, // "users" is actually uploads
        });

        // Save uploads separately for charts
        setUploads(res.data.users || []);
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

  const { uploadsData, chartData } = useMemo(() => {
    if (!uploads || uploads.length === 0) {
      return { uploadsData: [], chartData: [] };
    }

    // Count uploads per user
    const uploadsPerUser = uploads.reduce((acc, upload) => {
      const username = upload?.user?.username || "Unknown";
      acc[username] = (acc[username] || 0) + 1;
      return acc;
    }, {});

    const uploadsData = Object.keys(uploadsPerUser).map(user => ({
      name: user,
      uploads: uploadsPerUser[user],
    }));

    // Count chart types
    const chartTypeCount = uploads.reduce((acc, upload) => {
      if (Array.isArray(upload.charts)) {
        upload.charts.forEach(chart => {
          if (chart.chartType) {
            acc[chart.chartType] = (acc[chart.chartType] || 0) + 1;
          }
        });
      }
      return acc;
    }, {});

    const chartData = Object.keys(chartTypeCount).map(type => ({
      name: type,
      value: chartTypeCount[type],
    }));

    return { uploadsData, chartData };
  }, [uploads]);

  return (
    <div className="min-h-screen min-w-screen bg-gray-900 text-gray-200 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-gray-800 shadow-2xl shadow-purple-500/10 rounded-2xl p-6 sm:p-10 min-w-screen max-w-6xl mx-auto">
        
        {/* Top Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Users" value={stats.totalUsers} icon={<UserIcon />} />
          <StatCard title="Files Uploaded" value={stats.filesUploaded} icon={<FileIcon />} />
          <StatCard title="Admins" value={stats.adminCount} icon={<AdminIcon />} />
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-200">Uploads per User</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={uploadsData}>
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#374151', border: '1px solid #4b5563' }} />
                <Legend wrapperStyle={{ color: '#d1d5db' }}/>
                <Bar dataKey="uploads" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Line Chart Analysis */}
            <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl shadow-lg col-span-1 lg:col-span-1">
              <h2 className="text-xl font-bold mb-4 text-gray-200">Uploads Trend Analysis</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={uploadsData}>
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#374151', border: '1px solid #4b5563' }} />
                  <Legend wrapperStyle={{ color: '#d1d5db' }}/>
                  <Line type="monotone" dataKey="uploads" stroke="#00C49F" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

          <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-200">Chart Type Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#d1d5db', border: "1px solid #9ca3af", borderRadius: "8px" }}
                  itemStyle={{ color: "#4b5563", fontWeight: "bold" }}
                  labelStyle={{ color: "#4b5563", fontSize: "14px" }}
                />
                <Legend wrapperStyle={{ color: '#d1d5db' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// icons
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="text-blue-400">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="text-green-400">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="12" y1="18" x2="12" y2="12"></line>
    <line x1="9" y1="15" x2="15" y2="15"></line>
  </svg>
);

const AdminIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="text-purple-400">
    <path d="M12 2.69l.346.666L19.5 15.3l-1.88 3.42L12 21.35l-5.62-2.63L4.5 15.3l7.154-11.944.346-.666z"></path>
    <path d="M12 2.69L4.5 15.3l1.88 3.42L12 21.35l5.62-2.63 1.88-3.42L12 2.69z"></path>
    <path d="M12 22l5-2-5-9-5 9 5 2z"></path>
  </svg>
);

export default AdminDashboard;
