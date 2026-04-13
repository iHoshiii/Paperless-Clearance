import React, { useState } from 'react';
import DashboardCard from '../common/DashboardCard';
import OfficerApprovalQueue from '../common/OfficerApprovalQueue';

const NCSSCDashboard: React.FC = () => {
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
                description="Strategic Student Services Oversight"
                buttonText="Review Now"
                onClick={() => setView('approvals')}
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
