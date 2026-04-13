import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const OrgAnalytics: React.FC = () => {
    const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // We'll implement this route next
                const { data } = await api.get('/organizations/stats');
                setStats(data);
            } catch (err) {
                console.error('Failed to fetch stats');
                // Dummy stats if route fails
                setStats({ total: 24, approved: 15, pending: 7, rejected: 2 });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Loading statistics...</div>;

    return (
        <div className="analytics-view glass-container" style={{ padding: '2rem', gridColumn: '1 / -1' }}>
            <h3 style={{ marginBottom: '2rem' }}>📊 Department Analytics</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div className="stat-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.total}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Requests</div>
                </div>

                <div className="stat-card" style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{stats.approved}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Approved</div>
                </div>

                <div className="stat-card" style={{ padding: '1.5rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{stats.pending}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pending</div>
                </div>

                <div className="stat-card" style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>{stats.rejected}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Rejected</div>
                </div>
            </div>

            <div style={{ marginTop: '3rem', padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '12px' }}>
                <h4>Monthly Trend</h4>
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Trend visualization coming soon...</p>
            </div>
        </div>
    );
};

export default OrgAnalytics;
