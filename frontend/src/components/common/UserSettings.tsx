import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/auth';

const UserSettings: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { user, updateUser } = useAuth();
    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdateName = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            setSuccess('');
            const updatedUser = await authService.updateProfile({ firstName, lastName });
            updateUser(updatedUser);
            setSuccess('Profile updated successfully!');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPassword) return;
        try {
            setLoading(true);
            setError('');
            setSuccess('');
            await authService.changePassword(oldPassword, newPassword);
            setSuccess('Password changed successfully!');
            setOldPassword('');
            setNewPassword('');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-view glass-container" style={{ padding: '2rem', gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h3>⚙️ User Settings</h3>
                <button className="btn-text" onClick={onClose}>Close</button>
            </div>

            {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
            {success && <div style={{ color: 'var(--success)', marginBottom: '1rem' }}>{success}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                {/* Profile Section */}
                <div>
                    <h4>Update Profile Name</h4>
                    <form onSubmit={handleUpdateName}>
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="form-control" required />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="form-control" required />
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading}>Save Name</button>
                    </form>
                </div>

                {/* Password Section */}
                <div>
                    <h4>Change Password</h4>
                    <form onSubmit={handleChangePassword}>
                        <div className="form-group">
                            <label>Current Password</label>
                            <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="form-control" required />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="form-control" required />
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading}>Update Password</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserSettings;
