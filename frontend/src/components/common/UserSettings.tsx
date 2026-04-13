import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/auth';
import './UserSettings.css';

const UserSettings: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState<'name' | 'password'>('name');

    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');
    const [currentPassword, setCurrentPassword] = useState('');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdateName = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            setSuccess('');
            const updatedUser = await authService.updateProfile({
                firstName,
                lastName,
                password: currentPassword
            });
            updateUser(updatedUser);
            setSuccess('Profile name updated successfully!');
            setCurrentPassword('');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }
        try {
            setLoading(true);
            setError('');
            setSuccess('');
            await authService.changePassword(currentPassword, newPassword);
            setSuccess('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-view glass-container" style={{ padding: '2.5rem', gridColumn: '1 / -1', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>⚙️ Settings</h2>
                <button className="btn-text" onClick={onClose} style={{ fontSize: '1.2rem', padding: '0.5rem' }}>✕</button>
            </div>

            <div className="settings-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
                <button
                    className={`tab-btn ${activeTab === 'name' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('name'); setError(''); setSuccess(''); }}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'name' ? '3px solid var(--primary)' : '3px solid transparent',
                        color: activeTab === 'name' ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    Change Name
                </button>
                <button
                    className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('password'); setError(''); setSuccess(''); }}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'password' ? '3px solid var(--primary)' : '3px solid transparent',
                        color: activeTab === 'password' ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    Change Password
                </button>
            </div>

            {error && (
                <div style={{
                    padding: '1rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                    ⚠️ {error}
                </div>
            )}
            {success && (
                <div style={{
                    padding: '1rem',
                    background: 'rgba(16, 185, 129, 0.1)',
                    color: '#10b981',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                    ✅ {success}
                </div>
            )}

            {activeTab === 'name' ? (
                <form onSubmit={handleUpdateName}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div className="form-group">
                            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>First Name</label>
                            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="form-control" required style={{ width: '100%' }} />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Last Name</label>
                            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="form-control" required style={{ width: '100%' }} />
                        </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Verify Current Password</label>
                        <input
                            type="password"
                            placeholder="Type your password to confirm"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            className="form-control"
                            required
                            style={{ width: '100%', border: '1px solid var(--primary-light)' }}
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '1rem' }}>
                        {loading ? 'Processing...' : 'Save Profile Changes'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleChangePassword}>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Current Password</label>
                        <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="form-control" required style={{ width: '100%' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                        <div className="form-group">
                            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>New Password</label>
                            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="form-control" required style={{ width: '100%' }} />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Confirm New Password</label>
                            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="form-control" required style={{ width: '100%' }} />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '1rem' }}>
                        {loading ? 'Processing...' : 'Update Password'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default UserSettings;
