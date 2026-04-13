import React, { useState, useEffect } from 'react';
import clearanceService from '../../services/clearanceService';

interface ApprovalItem {
    id: string;
    status: string;
    remarks: string;
    request: {
        id: string;
        student: {
            first_name: string;
            last_name: string;
            email: string;
            student_id: string;
        };
    };
}

const OfficerApprovalQueue: React.FC = () => {
    const [pending, setPending] = useState<ApprovalItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchPending = async () => {
        try {
            setLoading(true);
            const data = await clearanceService.getPendingApprovals();
            setPending(data);
        } catch (err: any) {
            setError('Failed to load pending approvals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleAction = async (approvalId: string, status: 'approved' | 'rejected') => {
        const remarks = window.prompt(`Add remarks for ${status}:`) || '';

        try {
            setProcessingId(approvalId);
            await clearanceService.updateApprovalStatus(approvalId, status, remarks);
            // Refresh list
            setPending(prev => prev.filter(item => item.id !== approvalId));
        } catch (err) {
            alert('Failed to update status');
        } finally {
            setProcessingId(null);
        }
    };

    if (loading && pending.length === 0) return <div className="loading">Processing pending requests...</div>;

    return (
        <div className="approval-queue-container" style={{ gridColumn: '1 / -1' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>🎯</span> Pending Approvals
                <span className="badge-count" style={{
                    background: 'var(--primary)',
                    color: 'white',
                    fontSize: '0.8rem',
                    padding: '2px 8px',
                    borderRadius: '10px'
                }}>
                    {pending.length}
                </span>
            </h3>

            {error && <div className="alert-error" style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

            {pending.length === 0 ? (
                <div className="glass-container" style={{ padding: '3rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)' }}>All caught up! No pending clearance requests for your office.</p>
                </div>
            ) : (
                <div className="approval-list" style={{ display: 'grid', gap: '1rem' }}>
                    {pending.map(item => (
                        <div key={item.id} className="approval-row glass-container" style={{
                            padding: '1.2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderLeft: '4px solid var(--primary)'
                        }}>
                            <div className="student-info">
                                <h4 style={{ margin: 0 }}>{item.request.student.first_name} {item.request.student.last_name}</h4>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                    <span>ID: {item.request.student.student_id || 'N/A'}</span>
                                    <span style={{ margin: '0 8px' }}>•</span>
                                    <span>{item.request.student.email}</span>
                                </div>
                            </div>

                            <div className="actions" style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    className="btn-success"
                                    onClick={() => handleAction(item.id, 'approved')}
                                    disabled={processingId === item.id}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#10b981',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Approve
                                </button>
                                <button
                                    className="btn-danger"
                                    onClick={() => handleAction(item.id, 'rejected')}
                                    disabled={processingId === item.id}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OfficerApprovalQueue;
