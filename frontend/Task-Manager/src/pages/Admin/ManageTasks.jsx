import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuFileSpreadsheet } from 'react-icons/lu';
import TaskStatusTabs from '../../components/TaskStatusTabs';
import TaskCard from '../../components/Cards/TaskCard';
import toast from 'react-hot-toast';

const ManageTasks = () => {
    const [allTasks, setAllTasks] = useState([]);
    const [tabs, setTabs] = useState([]);
    const [filterStatus, setFilterStatus] = useState('All');
    const navigate = useNavigate();

    const getAllTasks = async () => {
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
        }
    };

    const handleClick = (task) => {
        // Pass taskId consistent with CreateTask component expectations
        navigate(`/admin/create-task`, { state: { taskId: task._id } });
    };

    const handleDownloadReport = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'task_details.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading task details:', error);
            toast.error('Failed to download task details. Please try again.');
        }
    };

    useEffect(() => {
        getAllTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStatus]);

    return (
        <DashboardLayout activeMenu="Manage Tasks">
            <div className="my-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold">My Tasks</h2>
                        <button
                            className="flex lg:hidden download-btn items-center gap-2"
                            onClick={handleDownloadReport}
                        >
                            <LuFileSpreadsheet className="text-lg" />
                            Download Report
                        </button>
                    </div>

                    {tabs.length > 0 && (
                        <div className="flex items-center gap-3 mt-3 lg:mt-0">
                            <TaskStatusTabs
                                tabs={tabs}
                                activeTab={filterStatus}
                                setActiveTab={setFilterStatus}
                            />
                            <button
                                className="hidden lg:flex download-btn items-center gap-2"
                                onClick={handleDownloadReport}
                            >
                                <LuFileSpreadsheet className="text-lg" />
                                Download Report
                            </button>
                        </div>
                    )}
                </div>

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
                            todoChecklist={item.todoChecklist || []}
                            onClick={() => handleClick(item)}
                        />
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ManageTasks;
