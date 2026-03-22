import React from 'react';
import DashboardCard from '../common/DashboardCard';

const MotherOrgDashboard: React.FC = () => {
    return (
        <>
            <DashboardCard
                icon="✅"
                title="Pending Approvals"
                description="Monitor and manage department-wide clearances"
                buttonText="Review Now"
            />
            <DashboardCard
                icon="📊"
                title="Analytics"
                description="View statistics and clearance reports"
                buttonText="View Reports"
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

export default MotherOrgDashboard;
