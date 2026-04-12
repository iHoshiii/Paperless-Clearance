import React, { useState, useEffect } from 'react';
import clearanceService, { ClearanceRequest, ClearancePeriod } from '../../services/clearanceService';

const StudentClearanceRequest: React.FC = () => {
    const [periods, setPeriods] = useState<ClearancePeriod[]>([]);
    const [requests, setRequests] = useState<ClearanceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            const [periodsData, requestsData] = await Promise.all([
                clearanceService.getPeriods(),
                clearanceService.getMyRequests()
            ]);
            setPeriods(periodsData);
            setRequests(requestsData);
        } catch (err: any) {
            setError('Failed to load clearance data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPeriod) return;

        try {
            setError('');
            setSuccess('');
            await clearanceService.submitRequest(selectedPeriod);
            setSuccess('Clearance request submitted successfully!');
            fetchData();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to submit request');
        }
    };

    return (
        <div className="clearance-manager">
            <h3>My Clearances</h3>

            <div className="section glass-container" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h4>New Request</h4>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div className="form-group" style={{ margin: 0, flex: 1 }}>
                        <label>Select Semester / Period</label>
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="form-control"
                            required
                        >
                            <option value="">-- Choose Period --</option>
                            {periods.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading || !selectedPeriod}>
                        Apply Now
                    </button>
                </form>
                {error && <p style={{ color: 'var(--danger)', marginTop: '10px' }}>{error}</p>}
                {success && <p style={{ color: 'var(--success)', marginTop: '10px' }}>{success}</p>}
            </div>

            <h4>Request History</h4>
            {loading ? (
                <p>Loading requests...</p>
            ) : (
                <div className="requests-list">
                    {requests.length === 0 ? (
                        <p>You haven't submitted any clearance requests yet.</p>
                    ) : (
                        requests.map(req => (
                            <div key={req.id} className="request-card glass-container" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div>
                                        <strong>{req.period?.name}</strong>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Submitted: {new Date(req.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`status-badge ${req.status}`}>
                                        {req.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>

                                <div className="approvals-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                                    {req.approvals?.map(app => (
                                        <div key={app.id} style={{
                                            padding: '10px',
                                            borderRadius: '0.5rem',
                                            border: '1px solid var(--border)',
                                            background: 'rgba(255,255,255,0.05)',
                                            fontSize: '0.9rem'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>{app.organization.name}</span>
                                                <span style={{
                                                    color: app.status === 'approved' ? 'var(--success)' :
                                                        app.status === 'rejected' ? 'var(--danger)' : 'var(--warning)'
                                                }}>
                                                    ●
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.status}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentClearanceRequest;
