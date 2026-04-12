import React, { useState } from 'react';
import DashboardCard from '../common/DashboardCard';
import OrganizationManager from '../admin/OrganizationManager';

const AdminDashboard: React.FC = () => {
    const [view, setView] = useState<'overview' | 'organizations'>('overview');

    if (view === 'organizations') {
        return (
            <div style={{ gridColumn: '1 / -1' }}>
                <button
                    className="btn-text"
                    onClick={() => setView('overview')}
                    style={{ marginBottom: '1rem', display: 'block' }}
                >
                    ← Back to Dashboard
                </button>
                <OrganizationManager />
            </div>
        );
    }

    return (
        <>
            <DashboardCard
                icon="🏛️"
                title="Organizations"
                description="Manage departments and health offices"
                buttonText="Manage Orgs"
                onClick={() => setView('organizations')}
            />
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
        </>
    );
};

export default AdminDashboard;
