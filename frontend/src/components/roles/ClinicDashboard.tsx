import React from 'react';
import DashboardCard from '../common/DashboardCard';

const ClinicDashboard: React.FC = () => {
    return (
        <>
            <DashboardCard
                icon="✅"
                title="Pending Approvals"
                description="Medical Clearance Administration"
                buttonText="Review Now"
            />
            <DashboardCard
                icon="🏥"
                title="Medical Records"
                description="Manage and update student medical clearance"
                buttonText="View Records"
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

export default ClinicDashboard;
