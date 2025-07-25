import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import moment from 'moment';
import AvatarGroup from '../../components/AvatarGroup';
import { LuSquareArrowOutUpRight } from 'react-icons/lu';
import toast from 'react-hot-toast';

const ViewTaskDetails = () => {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);

    const getStatusTagColor = (status) => {
        switch (status) {
            case "In Progress":
                return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
            case "Completed":
                return "text-lime-500 bg-lime-50 border border-lime-500/20";
            default:
                return "text-violet-500 bg-violet-50 border border-violet-500/10";
        }
    };

    const getTaskDetailsByID = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(API_PATHS.TASK.GET_TASK_BY_ID(id));
            if (response.data) {
                setTask(response.data);
            }
        } catch (error) {
            console.error("Error fetching task:", error);
            toast.error("Failed to load task details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const updatetodoChecklist = async (index) => {
        if (!task) return;

        // Deep copy to avoid mutating state directly
        const todoChecklist = task.todoChecklist ? task.todoChecklist.map(item => ({ ...item })) : [];
        if (todoChecklist[index]) {
            todoChecklist[index].completed = !todoChecklist[index].completed;
        }

        try {
            const response = await axiosInstance.put(
                API_PATHS.TASK.UPDATE_TODO_CHECKLIST(id),
                todoChecklist
            );

            if (response.status === 200) {
                // Assuming API returns updated task inside 'task' or the entire updated task
                setTask(response.data?.task || response.data || task);
                toast.success("Todo checklist updated");
            } else {
                // revert toggle if API fails
                todoChecklist[index].completed = !todoChecklist[index].completed;
                toast.error("Failed to update todo item");
            }
        } catch (error) {
            // revert toggle if error
            todoChecklist[index].completed = !todoChecklist[index].completed;
            console.error("Error updating todo checklist:", error);
            toast.error("Failed to update todo item");
        }
    };

    // handle attachment link click
    const handleLinkClick = (link) => {
        if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(link)) {
            link = "https://" + link; // Default to HTTPS if no protocol
        }
        window.open(link, "_blank", "noopener,noreferrer");
    };

    useEffect(() => {
        if (id) getTaskDetailsByID();
    }, [id]);

    if (loading) {
        return (
            <DashboardLayout activeMenu="My Tasks">
                <p className="text-center mt-10 text-gray-500">Loading task details...</p>
            </DashboardLayout>
        );
    }

    if (!task) {
        return (
            <DashboardLayout activeMenu="My Tasks">
                <p className="text-center mt-10 text-red-500">Task not found.</p>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout activeMenu="My Tasks">
            <div className='mt-5'>
                <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
                    <div className="form-card col-span-3">
                        <div className="flex items-center justify-between">
                            <h2 className='text-sm md:text-xl font-medium'>{task.title}</h2>
                            <div className={`text-[11px] md:text-[13px] font-medium ${getStatusTagColor(task.status)} px-4 py-0.5 rounded`}>
                                {task.status}
                            </div>
                        </div>

                        <div className="mt-4">
                            <InfoBox label="Description" value={task.description} />
                        </div>

                        <div className='grid grid-cols-12 gap-4 mt-4'>
                            <div className="col-span-6 md:col-span-4">
                                <InfoBox label="Priority" value={task.priority} />
                            </div>

                            <div className="col-span-6 md:col-span-4">
                                <InfoBox
                                    label="Due Date"
                                    value={
                                        task.dueDate
                                            ? moment(task.dueDate).format("Do MMM YYYY")
                                            : "N/A"
                                    }
                                />
                            </div>

                            <div className="col-span-6 md:col-span-4">
                                <label className='text-xs font-medium text-slate-500'>Assigned To</label>
                                <AvatarGroup
                                    avatars={task.assignedTo?.map((item) => item?.profileImageUrl).filter(Boolean) || []}
                                    maxVisible={5}
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="text-xs font-medium text-slate-500">Todo Checklist</label>
                            {Array.isArray(task.todoChecklist) && task.todoChecklist.length > 0 ? (
                                task.todoChecklist.map((item, index) => (
                                    <todoChecklist
                                        key={`todo_${index}`}
                                        text={item.text}
                                        isChecked={item?.completed}
                                        onChange={() => updatetodoChecklist(index)}
                                    />
                                ))
                            ) : (
                                <p className="text-sm text-slate-400 mt-1">No checklist items found.</p>
                            )}
                        </div>

                        {Array.isArray(task.attachments) && task.attachments.length > 0 && (
                            <div className="mt-4">
                                <label className="text-xs font-medium text-slate-500">Attachments</label>
                                {task.attachments.map((link, index) => (
                                    <Attachment
                                        key={`link_${index}`}
                                        link={link}
                                        index={index}
                                        onClick={() => handleLinkClick(link)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ViewTaskDetails;

// Reusable Components

const InfoBox = ({ label, value }) => (
    <>
        <label className='text-xs font-medium text-slate-500'>{label}</label>
        <p className='text-[12px] md:text-[13px] font-medium text-gray-700 mt-0.5'>
            {value || 'N/A'}
        </p>
    </>
);

const todoChecklist = ({ text, isChecked, onChange }) => (
    <div className="flex items-center gap-3 p-3">
        <input
            type='checkbox'
            checked={isChecked}
            onChange={onChange}
            className='w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer'
        />
        <p className={`text-[13px] ${isChecked ? 'line-through text-gray-400' : 'text-gray-500'}`}>{text}</p>
    </div>
);

const Attachment = ({ link, index, onClick }) => (
    <div
        className="flex justify-between bg-gray-100 border border-gray-200 px-3 py-2 rounded-md mb-3 mt-2 cursor-pointer hover:bg-gray-200"
        onClick={onClick}
    >
        <div className="flex-1 flex items-center gap-3">
            <span className='text-xs text-gray-400 font-semibold mr-2'>
                {index < 9 ? `0${index + 1}` : index + 1}
            </span>
            <p className="text-xs text-black break-all">{link}</p>
        </div>
        <LuSquareArrowOutUpRight className='text-gray-400' />
    </div>
);
