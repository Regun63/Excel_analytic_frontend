import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Verify = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
    const BACKEND_URL = import.meta.env.VITE_BACKEND;
  const onChangeHandler = (e) => {
    setInput(e.target.value);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/excel/user/verify-user`,
        { code: input },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/login');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Email Verification
        </h2>
        <form onSubmit={onSubmitHandler} className="space-y-4">
          <div>
            <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <input
              type="text"
              id="code"
              name="code"
              placeholder="Enter your verification code..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              onChange={onChangeHandler}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300 dark:bg-green-400 dark:hover:bg-green-700"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verify;
