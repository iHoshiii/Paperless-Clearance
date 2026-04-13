import React, { useState } from 'react';
import DashboardCard from '../common/DashboardCard';
import OfficerApprovalQueue from '../common/OfficerApprovalQueue';
import OrgAnalytics from '../common/OrgAnalytics';
import RecentNotifications from '../common/RecentNotifications';

const MotherOrgDashboard: React.FC = () => {
    const [view, setView] = useState<'overview' | 'approvals' | 'analytics' | 'notifications'>('overview');

    if (view !== 'overview') {
        return (
            <div style={{ gridColumn: '1 / -1' }}>
                <button
                    className="btn-text"
                    onClick={() => setView('overview')}
                    style={{ marginBottom: '1rem', display: 'block' }}
                >
                    ← Back to Dashboard
                </button>
                {view === 'approvals' && <OfficerApprovalQueue />}
                {view === 'analytics' && <OrgAnalytics />}
                {view === 'notifications' && <RecentNotifications />}
            </div>
        );
    }

    return (
        <>
            <DashboardCard
                icon="✅"
                title="Pending Approvals"
                description="Monitor and manage department-wide clearances"
                buttonText="Review Now"
                onClick={() => setView('approvals')}
            />
            <DashboardCard
                icon="📊"
                title="Analytics"
                description="View statistics and clearance reports"
                buttonText="View Reports"
                onClick={() => setView('analytics')}
            />
            <DashboardCard
                icon="🔔"
                title="Notifications"
                description="Stay updated with latest announcements"
                buttonText="View All"
                onClick={() => setView('notifications')}
            />
        </>
    );
};

export default MotherOrgDashboard;
