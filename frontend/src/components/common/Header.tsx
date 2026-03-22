import React from 'react';
import { User, UserRole } from '../../types/auth';
import { ROLE_DISPLAY_NAMES } from '../../constants';
import './Header.css';

interface HeaderProps {
    user: User | null;
    logout: () => void;
    welcomeMessage: string;
}

const Header: React.FC<HeaderProps> = ({ user, logout, welcomeMessage }) => {
    const getRoleDisplayName = (role: UserRole | string) => {
        return ROLE_DISPLAY_NAMES[role as UserRole] || role;
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
