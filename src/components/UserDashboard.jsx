import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { authActions } from '../redux/authSlice';
import { FaChartPie, FaTrashAlt, FaUpload, FaBraille, FaChartBar, FaChartLine } from 'react-icons/fa';

// count-up animation effect
const useCountUp = (end, duration = 1500) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const endValue = parseInt(end, 10);
    if (start === endValue) return;

    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * (endValue - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);
  return count;
};

// Animated counter component
const StatCard = ({ label, value, icon }) => {
  const count = useCountUp(value);
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 hover:bg-gray-700/60 hover:shadow-cyan-400/20 transform hover:-translate-y-1">
      <div className="text-3xl text-cyan-400">{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-white font-bold text-2xl">{count}</p>
      </div>
    </div>
  );
};


const UserDashboard = () => {
  const { users, uploads } = useSelector((state) => state.author);
  const dispatch = useDispatch();
    const BACKEND_URL = import.meta.env.VITE_BACKEND;
  const getChartIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'bar': return <FaChartBar className="text-blue-400" />;
      case 'line': return <FaChartLine className="text-green-400" />;
      case 'pie': return <FaChartPie className="text-purple-400" />;
      case 'scatter': return <FaBraille className="text-yellow-400" />;
      default: return <FaChartBar className="text-gray-400" />;
    }
  };

  const deleteHandler = async (uploadId, chartId) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/excel/upload/${uploadId}/deletechart/${chartId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(authActions.updateChart({ uploadId, charts: res.data.updatedCharts }));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting chart.');
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("http://localhost:8000/api/excel/upload/uploadFile", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        dispatch(authActions.setUploads(res.data.uploads || []));
        toast.success(res.data.message);
      } else {
        toast.error("Upload succeeded but no success flag.");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("File upload failed");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  const totalCharts = uploads?.reduce((acc, curr) => acc + (curr.charts?.length || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .card-container:hover .chart-item {
            transform: translateX(5px);
        }
      `}</style>
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="bg-gray-900/80 backdrop-blur-md w-full md:w-72 p-6 md:min-h-screen border-r border-gray-700/50">
          <h2 className="text-3xl font-bold text-cyan-400 mb-2 animate-pulse">
            Dashboard
          </h2>
          <p className="text-gray-400 mb-8">
            Welcome, <span className="font-semibold text-white">{users?.username}</span>
          </p>

          <div className="space-y-4 mb-8">
            <StatCard label="Total Uploads" value={uploads?.length || 0} icon={<FaUpload />} />
            <StatCard label="Total Charts" value={totalCharts} icon={<FaChartPie />} />
          </div>
          
          <label htmlFor="file-upload" className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-3 transition-all ease-in-out duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 shadow-md rounded-lg w-full font-medium cursor-pointer flex items-center justify-center gap-2">
            <FaUpload />
            New Upload
          </label>
          <input id="file-upload" type="file" onChange={handleFileChange} className="hidden" />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 bg-[url('C:\excel_analysis_platform\frontend\src\assets\bg-image2.jpg')] bg-cover bg-center">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Your Uploads & Charts</h1>

          {Array.isArray(uploads) && uploads.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {uploads.map((upload, index) => (
                <div 
                  key={index} 
                  style={{ animationDelay: `${index * 100}ms` }}
                  className="fade-in bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 ease-in-out transform hover:-translate-y-2 card-container"
                >
                  <h3 className="text-xl font-semibold text-cyan-300 mb-4 truncate">
                    📁 {upload.originalName}
                  </h3>
                  <div className="space-y-3">
                    {Array.isArray(upload.charts) && upload.charts.length > 0 ? (
                      upload.charts.map((chart, idx) => (
                        <div key={idx} className="border-l-4 border-gray-700 p-3 rounded-r-lg relative bg-gray-900/50 shadow-sm transition-transform duration-300 chart-item">
                          <div className="flex justify-between items-center">
                            <p className="text-gray-300 font-semibold text-sm flex items-center gap-2">
                              {getChartIcon(chart.chartType)}
                              {chart.chartType.toUpperCase()} Chart
                            </p>
                            <button onClick={() => deleteHandler(upload._id, chart._id)} className="text-sm text-red-500 hover:text-red-400 font-semibold transition-colors">
                              <FaTrashAlt />
                            </button>
                          </div>
                          {chart.aiSummary && (
                            <p className="mt-4 text-sm text-gray-200/90 italic bg-gray-800/50 p-3 rounded-lg break-words max-w-[450px] line-clamp-4 overflow-hidden text-ellipsis whitespace-nowrap">
                              <span className="font-bold text-cyan-400/70">AI:</span> {chart.aiSummary}
                            </p>

                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic text-sm text-center py-4">No charts available</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center mt-20 fade-in">
              <FaUpload className="text-6xl text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 text-lg italic">You haven’t uploaded anything yet.</p>
              <p className="text-gray-600 text-sm mt-2">Click 'New Upload' to get started!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
