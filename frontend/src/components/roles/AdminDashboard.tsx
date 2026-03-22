import React from 'react';
import DashboardCard from '../common/DashboardCard';

const AdminDashboard: React.FC = () => {
    return (
        <>
            <DashboardCard
                icon="✅"
                title="Pending Approvals"
                description="Review and approve clearance requests"
                buttonText="Review Now"
            />
            <DashboardCard
                icon="👥"
                title="User Management"
                description="Manage system-wide users and roles"
                buttonText="Manage Users"
            />
            <DashboardCard
                icon="📊"
                title="Analytics"
                description="View statistics and clearance reports"
                buttonText="View Reports"
            />
            <DashboardCard
                icon="🏥"
                title="Medical Records"
                description="Manage and update student medical clearance"
                buttonText="View Records"
            />
            <DashboardCard
                icon="🎓"
                title="Student Services"
                description="Oversee SAS-related clearance requirements"
                buttonText="Manage Services"
            />
            <DashboardCard
                icon="🏛️"
                title="Council Portal"
                description="Coordinate with NCSSC organizational headers"
                buttonText="Open Portal"
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

export default AdminDashboard;
