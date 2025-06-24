import React, { useContext } from 'react'
import { useUserAuth } from '../../components/hooks/useUserAuth'
import { UserContext } from '../../components/context/userContext';
import DashboardLayout from '../../components/layouts/DashboardLayout';

const Dashboard = () => {
    useUserAuth();

    const { user } = useContext(UserContext)

    return (
        <DashboardLayout activeMenu="Dashboard">
            Dashboard
            {/* {JSON.stringify(user)}  --> Show user information in UI */}

        </DashboardLayout>
    )
}

export default Dashboard
