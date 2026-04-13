import React, { useState, useEffect } from 'react';
import clearanceService, { ClearancePeriod } from '../../services/clearanceService';

const PeriodManager: React.FC = () => {
    const [periods, setPeriods] = useState<ClearancePeriod[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [newName, setNewName] = useState('');

    const fetchPeriods = async () => {
        try {
            setLoading(true);
            const data = await clearanceService.getPeriods();
            setPeriods(data);
        } catch (err) {
            setError('Failed to load periods');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPeriods();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await clearanceService.createPeriod({ name: newName });
            setNewName('');
            setShowAdd(false);
            fetchPeriods();
        } catch (err) {
            setError('Failed to create period');
        }
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
        try {
            await clearanceService.togglePeriod(id, !currentStatus);
            fetchPeriods();
        } catch (err) {
            setError('Failed to update period');
        }
    };

    return (
        <div className="period-manager">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3>Clearance Periods</h3>
                <button className="btn-primary" onClick={() => setShowAdd(true)}>+ New Semester</button>
            </div>

            {error && <div className="alert-error" style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

            {loading ? <p>Loading...</p> : (
                <div className="glass-container" style={{ padding: '0' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {periods.map(p => (
                                <tr key={p.id}>
                                    <td><strong>{p.name}</strong></td>
                                    <td>
                                        <span className={`status-badge ${p.is_active ? 'approved' : 'rejected'}`}>
                                            {p.is_active ? 'ACTIVE' : 'INACTIVE'}
                                        </span>
                                    </td>
                                    <td>{new Date(p.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            className="btn-text"
                                            onClick={() => handleToggle(p.id, p.is_active)}
                                        >
                                            {p.is_active ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showAdd && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h4>Create New Clearance Period</h4>
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label>Period Name</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    placeholder="e.g. 1st Semester 2025-2026"
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowAdd(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PeriodManager;
