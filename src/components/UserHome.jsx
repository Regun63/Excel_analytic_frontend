import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { authActions } from '../redux/authSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import ChartRenderer from './ChartRenderer';
import EntryBox from './EntryBox';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

const UserHome = () => {
  const { users, uploads } = useSelector((state) => state.author);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeUploadId, setActiveUploadId] = useState(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND;

  useEffect(() => {
    toast.success(`Welcome back ${users?.username}`, { position: "top-right" });
  }, []);

  const fetchUploads = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/excel/upload/getAllUploads`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(authActions.setUploads(res.data.uploads));
      }
    } catch (error) {
      toast.error("Failed to fetch uploads");
    }
  };

  useEffect(() => { fetchUploads(); }, []);

  const userUploads = Array.isArray(uploads)
    ? uploads.filter(upload => upload.user?._id === users?._id)
    : [];

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/excel/upload/uploadFile`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        fetchUploads();
        dispatch(authActions.setUploads(res.data.uploads || []));
        toast.success(res.data.message);
      } else toast.error("Upload succeeded but no success flag.");
    } catch (err) {
      toast.error("File upload failed");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) uploadFile(file);
  };

  const generateSummary = async (uploadId, chartId) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/excel/upload/summary/${uploadId}/${chartId}`, {}, { withCredentials: true });
      if (res.data.summary) {
        toast.success("AI summary generated!");
        fetchUploads();
      }
    } catch (error) {
      toast.error("Failed to generate AI summary");
    }
  };

  const deleteHandler = async (uploadId) => {
    try {
      const res = await axios.delete(`${BACKEND_URL}/api/excel/upload/deleteupload/${uploadId}`, { withCredentials: true });
      if (res.data.success) {
        fetchUploads();
        dispatch(authActions.setUploads(res.data.uploads));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Issue in deleting.");
    }
  };

  const handleGenerateChart = async ({ xAxis, yAxis, type, aiSummary }) => {
    if (!activeUploadId) return;
    try {
      const res = await axios.post(`${BACKEND_URL}/api/excel/upload/addchart/${activeUploadId}`, {
        selectedX: xAxis,
        selectedY: yAxis,
        chartType: type,
        aiSummary,
      }, { withCredentials: true });
      if (res?.data?.success) {
        toast.success(res.data.message);
        dispatch(authActions.addChart({
          uploadId: activeUploadId,
          charts: res.data.charts,
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setActiveUploadId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-start justify-center px-2 md:px-4 py-6">
      <div className="w-full max-w-7xl flex flex-col items-center">

        {/* Welcome Card */}
        <div className="bg-gray-800/70 backdrop-blur-sm shadow-2xl rounded-2xl p-6 w-full max-w-xl text-center transition-all duration-500 hover:scale-105">
          <h1 className="text-2xl sm:text-3xl font-bold text-white animate-pulse">
            Welcome, {users?.username || "User"} 👋
          </h1>
        </div>

        {/* Upload Button */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mt-6 w-full">
          <label className="w-full sm:w-auto shadow-lg hover:shadow-cyan-400/50 bg-blue-800 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 ease-in-out cursor-pointer transform hover:-translate-y-1 hover:scale-110">
            📁 Upload File
            <input type="file" onChange={handleFileChange} hidden />
          </label>
        </div>

        {/* File List */}
        <div className="flex flex-col justify-center items-start w-full mt-8 px-4">
          {userUploads.map((upload, i) => (
            <div key={upload._id || i} className="mb-6 bg-gray-800/50 backdrop-blur-md p-4 rounded-xl shadow-lg w-full transition-all duration-300 hover:shadow-2xl hover:bg-gray-700 transform hover:-translate-y-1">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-white">
                  File: {upload.originalName}
                </h2>
                {upload.headers?.length >= 2 && (
                  <div className='gap-4 flex'>
                    <button
                      onClick={() => deleteHandler(upload._id)}
                      className="bg-red-700 text-white px-4 py-2 transition-all duration-300 ease-in-out hover:cursor-pointer rounded-lg hover:bg-red-800 shadow-md hover:shadow-red-600/50 transform hover:scale-105"
                    >
                      Delete
                    </button>
                    <Button
                      sx={{
                        width: 160,
                        backgroundColor: 'green',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 200, 83, 0.4)',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: 'darkgreen', transform: 'scale(1.05) translateY(-2px)' }
                      }}
                      onClick={() => setActiveUploadId(upload._id)}
                    >
                      Generate Chart
                    </Button>
                    <Modal
                      open={activeUploadId === upload._id}
                      onClose={() => setActiveUploadId(null)}
                      className="flex items-center justify-center"
                    >
                      <Box className="bg-gray-900/90 backdrop-blur-lg p-4 rounded-xl shadow-2xl">
                        <EntryBox
                          headers={upload?.headers}
                          open={activeUploadId === upload._id}
                          onClose={() => setActiveUploadId(null)}
                          onGenerate={handleGenerateChart}
                        />
                      </Box>
                    </Modal>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Render Charts */}
        <div className="mt-10 w-full bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 max-w-6xl overflow-x-auto shadow-2xl">
          {userUploads.length > 0 ? (
            userUploads.map((upload, i) =>
              upload.charts?.map((chart, idx) => (
                <div key={idx} className="mb-10 border-b border-gray-600 pb-6 last:border-b-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-teal-300 mb-2">
                    {chart.chartType} Chart for "{upload.originalName}"
                  </h2>
                  <ChartRenderer
                    data={upload.rawData}
                    xKey={chart.selectedX}
                    yKey={chart.selectedY}
                    type={chart.chartType}
                    uploadId={upload._id}
                    chartId={chart._id}
                  />
                  {chart.aiSummary ? (
                    <p className="mt-4 text-sm font-bold text-white italic p-3 rounded-lg bg-purple-900/90">
                      <span className="font-extrabold text-teal-100/90">AI Summary:</span> {chart.aiSummary}
                    </p>
                  ) : (
                    <Button
                      sx={{
                        width: 160,
                        backgroundColor: 'purple',
                        color: 'white',
                        borderRadius: '8px',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: 'darkviolet' }
                      }}
                      onClick={() => generateSummary(upload._id, chart._id)}
                    >
                      Generate AI Insight
                    </Button>
                  )}
                </div>
              ))
            )
          ) : (
            <p className="text-gray-400 text-center py-8">No charts available. Upload a file to get started!</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserHome;
