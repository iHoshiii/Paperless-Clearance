import React from 'react';
import DashboardCard from '../common/DashboardCard';

const SASDashboard: React.FC = () => {
    return (
        <>
            <DashboardCard
                icon="✅"
                title="Pending Approvals"
                description="Student Affairs & Services Portal"
                buttonText="Review Now"
            />
            <DashboardCard
                icon="🎓"
                title="Student Services"
                description="Oversee SAS-related clearance requirements"
                buttonText="Manage Services"
            />
            <DashboardCard
                icon="📊"
                title="Analytics"
                description="View statistics and clearance reports"
                buttonText="View Reports"
            />
            <DashboardCard
                icon="👥"
                title="User Management"
                description="Manage institutional users and roles"
                buttonText="Manage Users"
            />
            <DashboardCard
                icon="🔔"
                title="Notifications"
                description="Stay updated with latest announcements"
                buttonText="View All"
            />
        </>
    );
};

export default SASDashboard;
