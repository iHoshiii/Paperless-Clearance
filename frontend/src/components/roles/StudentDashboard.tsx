import React, { useState } from 'react';
import DashboardCard from '../common/DashboardCard';
import StudentClearanceRequest from '../student/ClearanceRequest';

const StudentDashboard: React.FC = () => {
    const [view, setView] = useState<'overview' | 'requests'>('overview');

    if (view === 'requests') {
        return (
            <div style={{ gridColumn: '1 / -1' }}>
                <button
                    className="btn-text"
                    onClick={() => setView('overview')}
                    style={{ marginBottom: '1rem', display: 'block' }}
                >
                    ← Back to Dashboard
                </button>
                <StudentClearanceRequest />
            </div>
        );
    }

    return (
        <>
            <DashboardCard
                icon="📋"
                title="Clearance Status"
                description="View and manage your clearance requests"
                buttonText="View Clearances"
                onClick={() => setView('requests')}
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
