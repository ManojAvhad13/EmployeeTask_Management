import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuFileSpreadsheet } from 'react-icons/lu';
import UserCard from '../../components/Cards/UserCard';
import toast from 'react-hot-toast';

const ManageUsers = () => {
    const [allUsers, setAllUsers] = useState([]);

    // Fetch all users
    const getAllUsers = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);

            // Confirm the returned data shape; assuming response.data is an array
            if (Array.isArray(response.data) && response.data.length > 0) {
                setAllUsers(response.data);
            } else {
                setAllUsers([]); // Clear if empty or unexpected shape
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users.");
        }
    };

    // Download user report
    const handleDownloadReport = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'user_details.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // Changed to removeChild for consistency
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading user details:", error);
            toast.error("Failed to download user details. Please try again.");
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <DashboardLayout activeMenu="Team Members">
            <div className="mt-6 mb-10 px-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <h2 className="text-2xl font-semibold text-gray-800">Team Members</h2>
                    <button
                        onClick={handleDownloadReport}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    >
                        <LuFileSpreadsheet className="text-xl" />
                        Download Report
                    </button>
                </div>

                {allUsers.length === 0 ? (
                    <p className="mt-6 text-center text-gray-500">No users found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                        {allUsers.map((user) => (
                            <UserCard key={user._id} userInfo={user} />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ManageUsers;
