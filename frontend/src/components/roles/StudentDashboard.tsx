import React from 'react';
import DashboardCard from '../common/DashboardCard';

const StudentDashboard: React.FC = () => {
    return (
        <>
            <DashboardCard
                icon="📋"
                title="Clearance Status"
                description="View and manage your clearance requests"
                buttonText="View Clearances"
            />
            <DashboardCard
                icon="📄"
                title="Documents"
                description="Upload and manage required documents"
                buttonText="Manage Files"
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

export default StudentDashboard;
