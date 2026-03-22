import React from 'react';
import DashboardCard from '../common/DashboardCard';

const NCSSCDashboard: React.FC = () => {
    return (
        <>
            <DashboardCard
                icon="✅"
                title="Pending Approvals"
                description="Strategic Student Services Oversight"
                buttonText="Review Now"
            />
            <DashboardCard
                icon="🏛️"
                title="Council Portal"
                description="Coordinate with NCSSC organizational headers"
                buttonText="Open Portal"
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

export default NCSSCDashboard;
