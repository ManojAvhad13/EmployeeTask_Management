import React, { useContext, useState } from 'react'
import { UserContext } from '../context/userContext'
import Navbar from './Navbar';
import SideMenu from './SideMenu';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const DashboardLayout = ({ children, activeMenu }) => {

    const { user } = useContext(UserContext);

    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [pieChartData, setPieChartData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);

    const getDashboardData = async () => {
        try {
            const response = await axiosInstance.get(
                API_PATHS.TASK.GET_DASHBOARD_DATA
            );

            if (response.data) {
                setDashboardData(response.data);
            }
        } catch (error) {

        }
    }

    return (
        <div className=''>
            <Navbar activeMenu={activeMenu} />

            {user && (
                <div className="flex">
                    <div className='max-[1080]:hidden'>
                        <SideMenu activeMenu={activeMenu} />
                    </div>
                    <div className="grow mx-5">{children}</div>
                </div>
            )}
        </div>
    )
}

export default DashboardLayout
