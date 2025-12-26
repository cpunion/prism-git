import React from 'react';
import './index.css';

interface FileStatusBadgeProps {
    status: 'A' | 'M' | 'D' | 'R';
}

export function FileStatusBadge({ status }: FileStatusBadgeProps) {
    const statusMap = {
        A: { label: 'A', variant: 'added' },
        M: { label: 'M', variant: 'modified' },
        D: { label: 'D', variant: 'deleted' },
        R: { label: 'R', variant: 'renamed' },
    };

    const { label, variant } = statusMap[status];

    return (
        <span className={`file-status-badge file-status-badge--${variant}`}>
            {label}
        </span>
    );
}
