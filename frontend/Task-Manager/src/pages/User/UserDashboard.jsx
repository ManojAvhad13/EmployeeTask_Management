import React from 'react'
import { useUserAuth } from '../../components/hooks/useUserAuth'

const UserDashboard = () => {
    useUserAuth();
    return (
        <div>
            User Dashboard
        </div>
    )
}

export default UserDashboard
