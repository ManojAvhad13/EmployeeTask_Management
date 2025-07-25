import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuFileSpreadsheet } from 'react-icons/lu';
import TaskStatusTabs from '../../components/TaskStatusTabs';
import TaskCard from '../../components/Cards/TaskCard';
import toast from 'react-hot-toast';

const MyTasks = () => {
    const [allTasks, setAllTasks] = useState([]);
    const [tabs, setTabs] = useState([]);
    const [filterStatus, setFilterStatus] = useState('All');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getAllTasks = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(API_PATHS.TASK.GET_ALL_TASK, {
                params: {
                    status: filterStatus === 'All' ? '' : filterStatus,
                },
            });

            const tasks = response?.data?.tasks || [];
            setAllTasks(tasks);

            const statusSummary = response?.data?.statusSummary || {};
            setTabs([
                { label: 'All', count: statusSummary.all || 0 },
                { label: 'Pending', count: statusSummary.pendingTasks || 0 },
                { label: 'In Progress', count: statusSummary.inProgressTasks || 0 },
                { label: 'Completed', count: statusSummary.completedTasks || 0 },
            ]);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Failed to fetch tasks. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClick = (taskId) => {
        navigate(`/user/task-details/${taskId}`);
    };

    useEffect(() => {
        getAllTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStatus]);

    return (
        <DashboardLayout activeMenu="My Tasks">
            <div className="my-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <h2 className="text-xl font-semibold">My Tasks</h2>

                    {tabs.length > 0 && (
                        <TaskStatusTabs
                            tabs={tabs}
                            activeTab={filterStatus}
                            setActiveTab={setFilterStatus}
                        />
                    )}
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading tasks...</div>
                ) : allTasks.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No tasks found.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        {allTasks.map((item) => (
                            <TaskCard
                                key={item._id}
                                title={item.title}
                                description={item.description}
                                priority={item.priority}
                                status={item.status}
                                progress={item.progress}
                                createdAt={item.createdAt}
                                dueDate={item.dueDate}
                                assignedTo={item.assignedTo?.map(user => user?.profileImageUrl).filter(Boolean)}
                                attachmentCount={item.attachments?.length || 0}
                                completedTodoCount={item.completedTodoCount || 0}
                                todoChecklist={item.todoChecklist || []} // Fixed property name
                                onClick={() => handleClick(item._id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MyTasks;
