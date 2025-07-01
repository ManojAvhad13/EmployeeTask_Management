const mongoose = require('mongoose');

// Sub-schema for checklist items
const todoSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
        completed: { type: Boolean, default: false },
    },
    { _id: false } // Optional: prevents creating separate _id for subdocuments
);

// Main Task schema
const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },

        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium',
        },

        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Completed'],
            default: 'Pending',
        },

        dueDate: { type: Date, required: true },

        assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        todoChecklist: [todoSchema],

        attachments: [{ type: String }],

        progress: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Task', taskSchema);
