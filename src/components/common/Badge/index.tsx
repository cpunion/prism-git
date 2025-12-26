import React from 'react';
import './index.css';

interface BadgeProps {
    count?: number;
    children?: React.ReactNode;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

export function Badge({ count, children, variant = 'default' }: BadgeProps) {
    const displayText = count !== undefined ? count.toString() : children;

    if (!displayText) return null;

    return (
        <span className={`badge badge--${variant}`}>
            {displayText}
        </span>
    );
}
