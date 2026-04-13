import React, { useState } from 'react';
import DashboardCard from '../common/DashboardCard';
import OfficerApprovalQueue from '../common/OfficerApprovalQueue';

const AdviserDashboard: React.FC = () => {
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
                description="Review and approve student clearance forms"
                buttonText="Review Now"
                onClick={() => setView('approvals')}
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
