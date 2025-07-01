import React from 'react';
import Progress from '../layouts/Progress';
import AvatarGroup from '../AvatarGroup';
import { LuPaperclip } from 'react-icons/lu';
import moment from 'moment';

const TaskCard = ({
    title = '',
    description = '',
    priority = 'Low',
    status = 'Pending',
    progress = 0,
    createdAt,
    dueDate,
    assignedTo = [],
    attachmentCount = 0,
    completedTodoCount = 0,
    todoChecklist = [],
    onClick,
}) => {
    const getStatusTagColor = () => {
        switch (status) {
            case 'In Progress':
                return 'text-cyan-600 bg-cyan-100';
            case 'Completed':
                return 'text-lime-600 bg-lime-100';
            default:
                return 'text-violet-600 bg-violet-100';
        }
    };

    const getPriorityTagColor = () => {
        switch (priority) {
            case 'Low':
                return 'text-emerald-600 bg-emerald-100';
            case 'Medium':
                return 'text-amber-600 bg-amber-100';
            default:
                return 'text-rose-600 bg-rose-100';
        }
    };

    return (
        <div
            onClick={onClick}
            className="bg-white hover:shadow-xl transition-shadow duration-300 rounded-2xl p-5 border border-gray-200 shadow-sm cursor-pointer space-y-4"
        >
            {/* Status & Priority Labels */}
            <div className="flex flex-wrap gap-2 text-xs font-medium">
                <span className={`px-3 py-1 rounded-full ${getStatusTagColor()}`}>
                    {status}
                </span>
                <span className={`px-3 py-1 rounded-full ${getPriorityTagColor()}`}>
                    {priority} Priority
                </span>
            </div>

            {/* Title & Description */}
            <div>
                <h3 className="text-md font-semibold text-gray-800 line-clamp-2">{title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{description}</p>
            </div>

            {/* Progress Info */}
            <div>
                <p className="text-sm text-gray-600 font-medium">
                    Task Done:{' '}
                    <span className="font-bold text-gray-800">
                        {completedTodoCount} / {todoChecklist?.length || 0}
                    </span>
                </p>
                <Progress progress={progress} status={status} />
            </div>

            {/* Start & Due Dates */}
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-gray-400">Start</p>
                    <p className="text-gray-800 font-medium">
                        {createdAt ? moment(createdAt).format('Do MMM YYYY') : '-'}
                    </p>
                </div>
                <div>
                    <p className="text-gray-400">Due</p>
                    <p className="text-gray-800 font-medium">
                        {dueDate ? moment(dueDate).format('Do MMM YYYY') : '-'}
                    </p>
                </div>
            </div>

            {/* Footer: Assigned Avatars + Attachment Count */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <AvatarGroup avatars={assignedTo} />
                {attachmentCount > 0 && (
                    <div className="flex items-center gap-1 text-sm text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                        <LuPaperclip className="w-4 h-4" />
                        {attachmentCount}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
