import React, { useState } from 'react';
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

const TodoListInput = ({ todoList = [], setTodoList }) => {
    const [option, setOption] = useState("");

    const handleAddOption = () => {
        if (option.trim()) {
            setTodoList([...todoList, option.trim()]);
            setOption("");
        }
    };

    const handleDeleteOption = (index) => {
        const updateArr = todoList.filter((_, idx) => idx !== index);
        setTodoList(updateArr);
    };

    return (
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-md space-y-4 w-full max-w-sm">
            <label className="text-sm font-semibold text-gray-700 block mb-2">Todo Checklist</label>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {todoList.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl"
                    >
                        <div className="flex items-center gap-2 text-sm text-gray-800">
                            <span className="w-8 h-8 flex items-center justify-center bg-white border rounded-lg text-xs font-semibold text-gray-500">
                                {index < 9 ? `0${index + 1}` : index + 1}
                            </span>
                            <span>{item}</span>
                        </div>
                        <button
                            className="p-1 rounded hover:bg-red-100 transition"
                            onClick={() => handleDeleteOption(index)}
                            aria-label="Delete task"
                        >
                            <HiOutlineTrash className="text-base text-red-500 hover:text-red-600" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 pt-">
                <input
                    type="text"
                    placeholder="Enter task"
                    value={option}
                    onChange={({ target }) => setOption(target.value)}
                    className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                    onClick={handleAddOption}
                    disabled={!option.trim() || todoList.includes(option.trim())}
                    className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <HiMiniPlus className="text-base" />
                    Add
                </button>
            </div>
        </div>
    );
};

export default TodoListInput;
