import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Notif {
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    created_at: string;
}

const RecentNotifications: React.FC = () => {
    const { user } = useAuth();
    const [notifs, setNotifs] = useState<Notif[]>([]);

    useEffect(() => {
        // Dummy data for now
        const dummyNotifs: Notif[] = [
            { id: '1', message: 'New clearance request from John Student', type: 'info', created_at: new Date().toISOString() },
            { id: '2', message: 'Approval for "Maria Smith" completed', type: 'success', created_at: new Date().toISOString() },
            { id: '3', message: 'Clearance period "1st Sem 2024-2025" is now active', type: 'warning', created_at: new Date().toISOString() },
            { id: '4', message: 'System maintenance scheduled for tonight', type: 'error', created_at: new Date().toISOString() }
        ];
        setNotifs(dummyNotifs);
    }, []);

    return (
        <div className="notifications-view glass-container" style={{ padding: '2rem', gridColumn: '1 / -1' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>🔔</span> Recent Notifications
            </h3>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {notifs.map(n => (
                    <div key={n.id} style={{
                        padding: '1.2rem',
                        borderLeft: `4px solid ${n.type === 'success' ? '#10b981' : n.type === 'error' ? '#ef4444' : n.type === 'warning' ? '#f59e0b' : 'var(--primary)'}`,
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <p style={{ margin: 0, fontWeight: 'medium' }}>{n.message}</p>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(n.created_at).toLocaleString()}</span>
                        </div>
                        <button className="btn-text" style={{ fontSize: '0.8rem' }}>Dismiss</button>
                    </div>
                ))}
            </div>

            <button className="btn-text" style={{ marginTop: '1.5rem', width: '100%', textAlign: 'center' }}>
                Load more notifications...
            </button>
        </div>
    );
};

export default RecentNotifications;
