import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { PRIORITY_DATA } from '../../utils/data';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from "react-hot-toast";
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { LuTrash2 } from 'react-icons/lu';
import SelectDropdown from '../../components/Inputs/SelectDropdown';
import SelectUsers from '../../components/Inputs/SelectUsers';
import TodoListInput from '../../components/Inputs/TodoListInput';
import AddAttachmentInput from '../../components/Inputs/AddAttachmentInput';
import Modal from '../../components/Modal';
import DeleteAlert from '../../components/DeleteAlert';


const CreateTask = () => {
    const location = useLocation();
    const { taskId } = location.state || {};
    const navigate = useNavigate();

    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        priority: "Low",
        dueDate: "",               // using empty string for consistency with input value
        assignedTo: [],
        todoChecklist: [],
        attachments: [],
    });

    const [currentTask, setCurrentTask] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

    const handleValueChange = (key, value) => {
        setTaskData((prevData) => ({ ...prevData, [key]: value }));
    };

    const clearData = () => {
        setTaskData({
            title: "",
            description: "",
            priority: "Low",
            dueDate: "",
            assignedTo: [],
            todoChecklist: [],
            attachments: [],
        });
    };

    // Create Task
    const createTask = async () => {
        setLoading(true);
        try {
            const todolist = taskData.todoChecklist?.map((item) => ({
                text: item,
                completed: false,
            }));

            await axiosInstance.post(API_PATHS.TASK.CREATE_TASK, {
                ...taskData,
                dueDate: new Date(taskData.dueDate).toISOString(),
                todoChecklist: todolist,
            });

            toast.success("Task Created Successfully");
            clearData();
        } catch (error) {
            console.error("Error creating task:", error);
            toast.error(error?.response?.data?.message || "Failed to create task");
        } finally {
            setLoading(false);
        }
    };

    // Update Task
    const updateTask = async () => {
        setLoading(true);
        try {
            const todolist = taskData.todoChecklist?.map((item) => {
                const prevtodoChecklist = currentTask?.todoChecklist || [];
                const matchedTask = prevtodoChecklist.find((task) => task.text === item);

                return {
                    text: item,
                    completed: matchedTask ? matchedTask.completed : false,
                };
            });

            await axiosInstance.put(
                API_PATHS.TASK.UPDATE_TASK(taskId),
                {
                    ...taskData,
                    dueDate: new Date(taskData.dueDate).toISOString(),
                    todoChecklist: todolist,
                }
            );

            toast.success("Task Updated Successfully");

        } catch (error) {
            console.error("Error updating task:", error);
            toast.error(error?.response?.data?.message || "Failed to update task");
        } finally {
            setLoading(false);
        }
    };

    // Submit task button function
    const handleSubmit = async () => {
        setError("");

        // Input validation
        if (!taskData.title.trim()) {
            setError("Title is required.");
            return;
        }

        if (!taskData.description.trim()) {
            setError("Description is required.");
            return;
        }

        if (!taskData.dueDate) {
            setError("Date is required");
            return;
        }

        if (!taskData.assignedTo || taskData.assignedTo.length === 0) {
            setError("Task not assigned to any employee");
            return;
        }

        if (!taskData.todoChecklist || taskData.todoChecklist.length === 0) {
            setError("Add at least one todo task");
            return;
        }

        if (taskId) {
            updateTask();
            return;
        }

        createTask();
    };

    // Get task info by ID
    const getTaskDetailsByID = async () => {
        try {
            const response = await axiosInstance.get(
                API_PATHS.TASK.GET_TASK_BY_ID(taskId)
            );

            if (response?.data) {
                const taskInfo = response.data;
                setCurrentTask(taskInfo);

                setTaskData({
                    title: taskInfo.title || "",
                    description: taskInfo.description || "",
                    priority: taskInfo.priority || "Low",
                    dueDate: taskInfo.dueDate
                        ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
                        : "",
                    assignedTo: taskInfo.assignedTo?.map(item => item?._id) || [],
                    todoChecklist: taskInfo.todoChecklist?.map(item => item?.text) || [],
                    attachments: taskInfo.attachments || [],
                });
            }
        } catch (error) {
            console.error("Error fetching task details:", error);
            toast.error("Failed to fetch task details");
        }
    };

    // Delete Task
    const deleteTask = async () => {
        try {
            await axiosInstance.delete(API_PATHS.TASK.DELETE_TASK(taskId));

            setOpenDeleteAlert(false);
            toast.success("Task deleted successfully");
            navigate('/admin/task')
        } catch (error) {
            console.error("Error deleting task:", error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Failed to delete task");
        }
    };

    useEffect(() => {
        if (taskId) {
            getTaskDetailsByID();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskId]);

    return (
        <DashboardLayout activeMenu="Create Task">
            <div className="mt-5">
                <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
                    <div className="form-card col-span-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl md:text-xl font-medium">
                                {taskId ? "Update Task" : "Create Task"}
                            </h2>

                            {taskId && (
                                <button
                                    className='flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer'
                                    onClick={() => setOpenDeleteAlert(true)}
                                >
                                    <LuTrash2 className='text-base' /> Delete
                                </button>
                            )}
                        </div>

                        <div className="mt-4">
                            <label className='text-xs font-medium text-slate-600'>
                                Task Title
                            </label>

                            <input
                                placeholder='Create App UI'
                                className='form-input'
                                value={taskData.title}
                                onChange={({ target }) => {
                                    handleValueChange("title", target.value)
                                }}
                            />
                        </div>

                        <div className="mt-3">
                            <label className='text-xs font-medium text-slate-600'>
                                Description
                            </label>

                            <textarea
                                placeholder='Describe task'
                                className='form-input'
                                rows={4}
                                value={taskData.description}
                                onChange={({ target }) => {
                                    handleValueChange("description", target.value)
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-12 gap-4 mt-2">
                            <div className="col-span-6 md:col-span-4">
                                <label className='text-xs font-medium text-slate-600'>
                                    Priority
                                </label>

                                <SelectDropdown
                                    option={PRIORITY_DATA}
                                    value={taskData.priority}
                                    onChange={(value) => handleValueChange("priority", value)}
                                    placeholder="Select Priority"
                                />
                            </div>

                            <div className="col-span-6 md:col-span-4">
                                <label className='text-xs font-medium text-slate-600'>
                                    Due Date
                                </label>

                                <input
                                    placeholder='Create App UI'
                                    className='form-input'
                                    value={taskData.dueDate}
                                    onChange={({ target }) => {
                                        handleValueChange("dueDate", target.value)
                                    }}
                                    type='date'
                                />
                            </div>

                            <div className="col-span-12 md:col-span-3">
                                <label className='text-xs font-medium text-slate-600'>
                                    Assign To
                                </label>

                                <SelectUsers
                                    selectedUsers={taskData.assignedTo}
                                    setSelectedUsers={(value) => {
                                        handleValueChange("assignedTo", value);
                                    }}
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className='text-xs font-medium text-slate-600'>
                                Todo Checklist
                            </label>

                            <TodoListInput
                                todoList={taskData?.todoChecklist}
                                setTodoList={(value) => {
                                    handleValueChange("todoChecklist", value)
                                }} />
                        </div>

                        <div className="mt-3">
                            <label className='text-xs font-medium text-slate-600'>
                                Add Attachments
                            </label>

                            <AddAttachmentInput
                                attachments={taskData?.attachments}
                                setAttachments={(value) =>
                                    handleValueChange("attachments", value)
                                }
                            />
                        </div>

                        {error && (
                            <p className='text-xs font-medium text-red-500 mt-5'>{error}</p>
                        )}

                        <div className='flex justify-end mt-7'>
                            <button
                                className='add-btn'
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {taskId ? "UPDATE TASK" : "CREATE TASK"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={openDeleteAlert}
                onClose={() => setOpenDeleteAlert(false)}
                title="Delete Task">
                <DeleteAlert
                    content="Are you sure you want to delete this task"
                    onDelete={() => deleteTask()} />
            </Modal>
        </DashboardLayout>
    )
}

export default CreateTask;
