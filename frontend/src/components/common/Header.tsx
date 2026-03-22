import React from 'react';
import { User, UserRole } from '../../types/auth';
import './Header.css';

interface HeaderProps {
    user: User | null;
    logout: () => void;
    welcomeMessage: string;
}

const Header: React.FC<HeaderProps> = ({ user, logout, welcomeMessage }) => {
    const getRoleDisplayName = (role: UserRole | string) => {
        const roleNames: Record<string, string> = {
            [UserRole.STUDENT]: 'Student',
            [UserRole.SUB_ORGANIZATION]: 'Sub-Organization',
            [UserRole.MOTHER_ORGANIZATION]: 'Mother Organization',
            [UserRole.ADVISER]: 'Adviser',
            [UserRole.NCSSC]: 'NCSSC',
            [UserRole.CLINIC]: 'Clinic',
            [UserRole.SAS]: 'SAS',
            [UserRole.ADMIN]: 'Administrator'
        };
        return roleNames[role] || role;
    };

    return (
        <header className="dashboard-header">
            <div className="header-content">
                <div className="header-left">
                    <h1>Paperless Clearance</h1>
                    <p className="header-subtitle">{welcomeMessage}</p>
                </div>
                <div className="header-right">
                    <div className="user-info">
                        <span className="user-name">{user?.first_name} {user?.last_name}</span>
                        <span className="user-role">{getRoleDisplayName(user?.role || '')}</span>
                    </div>
                    <button onClick={logout} className="logout-button">
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
