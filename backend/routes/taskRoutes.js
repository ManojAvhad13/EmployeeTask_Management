const express = require("express");
const {
    getDashboardData,
    getUserDashboardData,
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskChecklist,
    updateTaskStatus,
} = require("../controllers/taskController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

// Task Management Routes

// Dashboard routes
router.get("/dashboard-data", protect, getDashboardData); // Admin dashboard
router.get("/user-dashboard-data", protect, getUserDashboardData); // User dashboard

// Task CRUD routes
router.get("/", protect, getTasks); // Get all tasks (admin: all, user: assigned)
router.get("/:id", protect, getTaskById); // Get a task by ID
router.post("/", protect, createTask); // ✅ Corrected: only one createTask
router.put("/:id", protect, updateTask); // Update task
router.delete("/:id", protect, adminOnly, deleteTask); // Only admin can delete

// Task status & checklist updates
router.put("/:id/status", protect, updateTaskStatus); // Update task status
router.put("/:id/todo", protect, updateTaskChecklist); // Update task checklist

module.exports = router;
