import React, { useState, useEffect } from 'react';
import organizationService, { Organization } from '../../services/organizationService';

const OrganizationManager: React.FC = () => {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showAddModal, setShowAddModal] = useState(false);
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');

    const fetchOrganizations = async () => {
        try {
            setLoading(true);
            const data = await organizationService.getAll();
            setOrganizations(data);
            setError('');
        } catch (err: any) {
            setError('Failed to fetch organizations');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await organizationService.create({ name: newName, description: newDesc });
            setNewName('');
            setNewDesc('');
            setShowAddModal(false);
            fetchOrganizations();
        } catch (err: any) {
            setError('Failed to create organization');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this organization?')) {
            try {
                await organizationService.delete(id);
                fetchOrganizations();
            } catch (err: any) {
                setError('Failed to delete organization');
            }
        }
    };

    return (
        <div className="org-manager">
            <div className="org-header">
                <h3>System Organizations</h3>
                <button className="btn-primary" onClick={() => setShowAddModal(true)}>+ Add New</button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <p>Loading organizations...</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {organizations.length === 0 ? (
                            <tr><td colSpan={4}>No organizations found.</td></tr>
                        ) : (
                            organizations.map(org => (
                                <tr key={org.id}>
                                    <td><strong>{org.name}</strong></td>
                                    <td>{org.description || 'No description'}</td>
                                    <td>{new Date(org.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <button className="btn-text delete" onClick={() => handleDelete(org.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h4>Add New Organization</h4>
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="e.g. Clinic, SAS, Library"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={newDesc}
                                    onChange={(e) => setNewDesc(e.target.value)}
                                    placeholder="What does this organization do?"
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrganizationManager;
