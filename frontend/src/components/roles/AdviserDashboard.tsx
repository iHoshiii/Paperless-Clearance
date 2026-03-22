import React from 'react';
import DashboardCard from '../common/DashboardCard';

const AdviserDashboard: React.FC = () => {
    return (
        <>
            <DashboardCard
                icon="✅"
                title="Pending Approvals"
                description="Review and approve student clearance forms"
                buttonText="Review Now"
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

export default AdviserDashboard;
