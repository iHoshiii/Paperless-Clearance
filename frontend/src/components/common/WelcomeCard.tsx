import React from 'react';
import { User, UserRole } from '../../types/auth';
import './WelcomeCard.css';

interface WelcomeCardProps {
    user: User | null;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ user }) => {
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
        <div className="welcome-card">
            <div className="welcome-content">
                <h2>Welcome Back, {user?.first_name}!</h2>
                <p>You are logged in as a <strong>{getRoleDisplayName(user?.role || '')}</strong></p>
                <div className="user-details-pills">
                    {user?.student_id && (
                        <span className="detail-pill">ID: <strong>{user.student_id}</strong></span>
                    )}
                    {user?.department && (
                        <span className="detail-pill">Dept: <strong>{user.department}</strong></span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WelcomeCard;
