import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from "../../components/context/userContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const { updateUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!password) {
            setError("Password is required.");
            return;
        }

        setError("");

        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
                email,
                password,
            });

            const { token, role } = response.data;

            if (token) {
                localStorage.setItem("token", token);
                updateUser(response.data);

                if (role === "admin") {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/user/dashboard");
                }
            }

        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back</h2>
                    <p className="text-sm text-gray-600 mb-6">Please enter your details to log in</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            value={email}
                            onChange={({ target }) => setEmail(target.value)}
                            label="Email Address"
                            placeholder="Enter your email"
                            type="email"
                        />

                        <Input
                            value={password}
                            onChange={({ target }) => setPassword(target.value)}
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                        />

                        {error && <p className="text-sm text-red-500 -mt-2">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-xl hover:bg-blue-700 transition"
                        >
                            Login
                        </button>
                    </form>

                    <p className="text-sm text-center text-gray-700 mt-6">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-blue-600 font-medium hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right - Task Manager Visual */}
            <div className="hidden lg:flex w-1/2  from-indigo-400 to-purple-600 items-center justify-center p-10">
                <div className="text-center text-black max-w-md">
                    <img
                        src="/src/assets/images/taskimage.png"
                        alt="Task Manager"
                        className="w-100 mx-auto mb-6"
                    />
                    <h2 className="text-2xl font-semibold">Task Management Simplified</h2>
                    <p className="text-lg mt-3">
                        Manage your tasks, boost your productivity, and achieve your goals with our smart task manager dashboard.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
