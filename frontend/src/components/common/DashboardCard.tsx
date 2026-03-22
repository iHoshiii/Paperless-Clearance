import React from 'react';
import './DashboardCard.css';

interface DashboardCardProps {
    icon: string;
    title: string;
    description: string;
    buttonText: string;
    onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
    icon,
    title,
    description,
    buttonText,
    onClick
}) => {
    return (
        <div className="dashboard-card" onClick={onClick}>
            <div className="card-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{description}</p>
            <button className="card-button">{buttonText}</button>
        </div>
    );
};

export default DashboardCard;
