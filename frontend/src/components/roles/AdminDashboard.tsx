import React, { useState } from 'react';
import DashboardCard from '../common/DashboardCard';
import OrganizationManager from '../admin/OrganizationManager';
import PeriodManager from '../admin/PeriodManager';
import OfficerApprovalQueue from '../common/OfficerApprovalQueue';

const AdminDashboard: React.FC = () => {
    const [view, setView] = useState<'overview' | 'organizations' | 'periods' | 'approvals'>('overview');

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
                {view === 'organizations' && <OrganizationManager />}
                {view === 'periods' && <PeriodManager />}
                {view === 'approvals' && <OfficerApprovalQueue />}
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
                icon="📅"
                title="Clearance Periods"
                description="Open or close semesters for clearance"
                buttonText="Manage Periods"
                onClick={() => setView('periods')}
            />
            <DashboardCard
                icon="✅"
                title="Pending Approvals"
                description="Review and approve clearance requests"
                buttonText="Review Now"
                onClick={() => setView('approvals')}
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
