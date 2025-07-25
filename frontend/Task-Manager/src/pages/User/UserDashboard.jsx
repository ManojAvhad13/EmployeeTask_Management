import React, { useContext, useEffect, useState } from 'react';
import { useUserAuth } from '../../components/hooks/useUserAuth';
import { UserContext } from '../../components/context/userContext';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import moment from 'moment';
import InfoCard from '../../components/Cards/InfoCard';
import { addThousandSeparator } from '../../utils/helper';
import { LuArrowRight } from 'react-icons/lu';
import TaskListTable from '../../components/TaskListTable';
import CustomPieChart from '../../components/Charts/CustomPieChart';
import CustomBarChart from '../../components/Charts/CustomBarChart';
import toast from 'react-hot-toast';

const COLORS = ['#8D51FF', '#00B8D8', '#7BCE00'];

const UserDashboard = () => {
    useUserAuth();

    const { user } = useContext(UserContext);

    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [pieChartData, setPieChartData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    const prepareChartData = (data) => {
        const taskDistribution = data?.taskDistribution || {};
        const taskPriorityLevels = data?.taskPriorityLevels || {};

        const taskDistributionData = [
            { status: 'Pending', count: taskDistribution.Pending || 0 },
            { status: 'In Progress', count: taskDistribution.InProgress || 0 },
            { status: 'Completed', count: taskDistribution.Completed || 0 },
        ];
        setPieChartData(taskDistributionData);

        const priorityLevelData = [
            { priority: 'Low', count: taskPriorityLevels.Low || 0 },
            { priority: 'Medium', count: taskPriorityLevels.Medium || 0 },
            { priority: 'High', count: taskPriorityLevels.High || 0 },
        ];
        setBarChartData(priorityLevelData);
    };

    const getDashboardData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(API_PATHS.TASK.GET_USER_DASHBOARD_DATA);
            if (response.data) {
                setDashboardData(response.data);
                prepareChartData(response.data.charts || {});
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onSeeMore = () => {
        navigate('/admin/tasks');
    };

    useEffect(() => {
        getDashboardData();
    }, []);

    // Calculate total tasks from available data for clarity
    const totalTasks =
        dashboardData?.charts?.taskDistribution?.All !== undefined
            ? dashboardData.charts.taskDistribution.All
            : ((dashboardData?.charts?.taskDistribution?.Pending || 0) +
                (dashboardData?.charts?.taskDistribution?.InProgress || 0) +
                (dashboardData?.charts?.taskDistribution?.Completed || 0));

    return (
        <DashboardLayout activeMenu="Dashboard">
            {loading ? (
                <div className="text-center py-10 text-gray-600">Loading dashboard data...</div>
            ) : (
                <>
                    <div className="card my-5">
                        <div>
                            <div className="col-span-3">
                                <h2 className="text-xl md:text-2xl">Good Morning! {user?.name}</h2>
                                <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">{moment().format('dddd Do MMM YYYY')}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
                            <InfoCard label="Total Task" value={addThousandSeparator(totalTasks)} color="bg-blue-500" />
                            <InfoCard
                                label="Pending Task"
                                value={addThousandSeparator(dashboardData?.charts?.taskDistribution?.Pending || 0)}
                                color="bg-violet-500"
                            />
                            <InfoCard
                                label="In Progress Task"
                                value={addThousandSeparator(dashboardData?.charts?.taskDistribution?.InProgress || 0)}
                                color="bg-cyan-500"
                            />
                            <InfoCard
                                label="Completed Task"
                                value={addThousandSeparator(dashboardData?.charts?.taskDistribution?.Completed || 0)}
                                color="bg-lime-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
                        <div>
                            <div className="card">
                                <div className="flex items-center justify-between">
                                    <h5 className="font-medium">Task Distribution</h5>
                                </div>
                                <CustomPieChart data={pieChartData} color={COLORS} />
                            </div>
                        </div>

                        <div>
                            <div className="card">
                                <div className="flex items-center justify-between">
                                    <h5 className="font-medium">Task Priority Levels</h5>
                                </div>
                                <CustomBarChart data={barChartData} />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <div className="card">
                                <div className="flex items-center justify-between">
                                    <h5 className="text-lg">Recent Tasks</h5>

                                    <button className="card-btn flex items-center gap-1" onClick={onSeeMore}>
                                        See All <LuArrowRight className="text-base" />
                                    </button>
                                </div>

                                <TaskListTable tableData={dashboardData?.recentTasks || []} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </DashboardLayout>
    );
};

export default UserDashboard;
