import React, { useState } from 'react';
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

const TodoListInput = ({ todoList = [], setTodoList }) => {
    const [option, setOption] = useState("");

    const handleAddOption = () => {
        const trimmed = option.trim();
        if (trimmed && !todoList.includes(trimmed)) {
            setTodoList([...todoList, trimmed]);
            setOption("");
        }
    };

    const handleDeleteOption = (index) => {
        setTodoList(todoList.filter((_, idx) => idx !== index));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddOption();
        }
    };

    return (
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-md space-y-4 w-full max-w-sm">
            <label className="text-sm font-semibold text-gray-700 block mb-2">Todo Checklist</label>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {todoList.map((item, index) => (
                    <div
                        key={item} // Using item text as key assuming unique
                        className="flex items-center justify-between bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl"
                    >
                        <div className="flex items-center gap-2 text-sm text-gray-800">
                            <span className="w-8 h-8 flex items-center justify-center bg-white border rounded-lg text-xs font-semibold text-gray-500">
                                {index + 1 < 10 ? `0${index + 1}` : index + 1}
                            </span>
                            <span>{item}</span>
                        </div>
                        <button
                            type="button"
                            className="p-1 rounded hover:bg-red-100 transition"
                            onClick={() => handleDeleteOption(index)}
                            aria-label={`Delete task: ${item}`}
                        >
                            <HiOutlineTrash className="text-base text-red-500 hover:text-red-600" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Enter task"
                    value={option}
                    onChange={(e) => setOption(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                    aria-label="Add todo task"
                />
                <button
                    type="button"
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
