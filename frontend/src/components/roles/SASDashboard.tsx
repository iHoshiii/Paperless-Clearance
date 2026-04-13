import React, { useState } from 'react';
import DashboardCard from '../common/DashboardCard';
import OfficerApprovalQueue from '../common/OfficerApprovalQueue';

const SASDashboard: React.FC = () => {
    const [view, setView] = useState<'overview' | 'approvals'>('overview');

    if (view === 'approvals') {
        return (
            <div style={{ gridColumn: '1 / -1' }}>
                <button
                    className="btn-text"
                    onClick={() => setView('overview')}
                    style={{ marginBottom: '1rem', display: 'block' }}
                >
                    ← Back to Dashboard
                </button>
                <OfficerApprovalQueue />
            </div>
        );
    }

    return (
        <>
            <DashboardCard
                icon="✅"
                title="Pending Approvals"
                description="Student Affairs & Services Portal"
                buttonText="Review Now"
                onClick={() => setView('approvals')}
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
