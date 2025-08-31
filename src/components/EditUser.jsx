import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { FiUser, FiMail, FiShield, FiCamera } from 'react-icons/fi';
import { authActions } from '../redux/authSlice';

const EditUser = () => {
    const { users } = useSelector((str) => str.author);
    const [profilePicPreview, setProfilePicPreview] = useState(null);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
        const BACKEND_URL = import.meta.env.VITE_BACKEND;
    const [input, setInput] = useState({
        profilePicture: null, 
        email: users?.email || '',
        role: users?.role=='admin' ? 'Admin' :users?.role=='superadmin' ?"SuperAdmin": 'User',
        username: users?.username || ''
    });

    const handleProfilePictureChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            setInput({ ...input, profilePicture: file });
            setProfilePicPreview(preview);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        data.append("username", input.username);
        data.append("email", input.email);
        data.append("role", input.role);
        if (input.profilePicture) {
            data.append("profilePicture", input.profilePicture);
        }

        try {
            const res = await axios.post(`${BACKEND_URL}/api/excel/user/edit`, data, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (res.data.success) {
                const updatedUserData = {
                    ...users,
                    profilePicture: res.data.user?.profilePicture,
                    email: res.data.user?.email,
                    username: res.data.user?.username
                };

                dispatch(authActions.setAuthUser(updatedUserData));
                toast.success(res.data.message);
                navigate('/user_dashboard');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex justify-center items-center p-4">
             <style>{`
                @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
                }
                .form-fade-in {
                animation: fadeIn 0.5s ease-out forwards;
                }
            `}</style>
            <form
                onSubmit={handleSubmit}
                className="form-fade-in bg-gray-800/40 backdrop-blur-md rounded-2xl p-8 w-full max-w-lg shadow-2xl border border-gray-700/50"
            >
                <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
                    Edit Profile
                </h2>

                <div className="flex flex-col items-center mb-8">
                    <div className="relative group">
                        <Avatar className="h-28 w-28 rounded-full overflow-hidden border-4 border-gray-700 group-hover:border-cyan-500 transition-all duration-300 shadow-lg">
                            <AvatarImage
                                src={profilePicPreview || users?.profilePicture?.url}
                                alt="Profile"
                                className="object-cover w-full rounded-2xl h-full"
                            />
                            <AvatarFallback className="w-28 h-28 rounded-full border-2  flex items-center justify-center text-cyan-400 text-4xl font-bold">
                                {users?.username?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <label
                            htmlFor="profilePicture"
                            className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-2xl opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300 cursor-pointer"
                        >
                            <FiCamera />
                        </label>
                        <input
                            type="file"
                            id="profilePicture"
                            name="profilePicture"
                            hidden
                            onChange={handleProfilePictureChange}
                            accept="image/*"
                        />
                    </div>
                </div>
                
                {/* Input Fields */}
                <div className="space-y-6">
                    {/* Username */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><FiUser /></span>
                            <input
                                id="username" type="text" value={input.username}
                                onChange={(e) => setInput({ ...input, username: e.target.value })}
                                placeholder="Enter username" required
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:ring-2 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 transition shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><FiMail /></span>
                            <input
                                id="email" type="email" value={input.email}
                                onChange={(e) => setInput({ ...input, email: e.target.value })}
                                placeholder="Enter email" required
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:ring-2 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 transition shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Role */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><FiShield /></span>
                            <input
                                id="role" type="text" name="role" value={input.role}
                                readOnly
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-900/60 border border-gray-700 text-gray-400 cursor-not-allowed shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-8 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-700/50 disabled:cursor-wait text-white text-lg font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center"
                >
                    {loading ? (
                        <>
                            <svg aria-hidden="true" className="inline w-6 h-6 mr-3 text-gray-200 animate-spin fill-cyan-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            Saving...
                        </>
                    ) : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default EditUser;
