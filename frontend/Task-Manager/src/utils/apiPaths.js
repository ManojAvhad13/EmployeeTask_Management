export const BASE_URL = "http://localhost:8000";

//utils/apiPaths.js

export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register", // Register a new user (Admin or Member)
        LOGIN: "/api/auth/login", // Authenticate user & return JWT token
        GET_PROFILE: "/api/auth/profile", // Get logged-in user details
    },

    USERS: {
        GET_ALL_USERS: "/api/users", // Get all users (Admin only)
        GET_USER_BY_ID: (userId) => '/api/users/${userId}', // Get user by ID
        CREATE_USER: "/api/users", // Create a new user (Admin only)
        UPDATE_USER: (userId) => '/api/users/${userId}', // Update user details
        DELETE_USER: (userId) => '/api/users/${userId}', // Delete a user (Admin only)
    },

    TASK: {
        GET_DASHBOARD_DATA: "/api/tasks/dashboard-data", // Get dashboard data (Admin & Member)
        GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data", // Get user-specific dashboard data
        GET_ALL_TASK: "/api/tasks", // Get all tasks (Admin & Member-Only Assigned)
        GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`, // Get task by ID
        CREATE_TASK: "/api/tasks", // Create a new task (Admin & Member)
        UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`, // Update task details
        DELETE_TASK: (taskId) => `/api/tasks/${taskId}`, // Delete a task (Admin

        UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`, // Update task status
        UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`, // Update task checklist
    },

    REPORTS: {
        EXPORT_TASKS: "/api/reports/export/tasks", // Download and Export tasks as CSV (Admin & Member)
        EXPORT_USERS: "/api/reports/export/users", // Download and Export users as CSV (Admin only)
    },

    IMAGE: {
        UPLOAD_IMAGE: "/api/image/upload", // Upload image (Admin & Member)
    }
}