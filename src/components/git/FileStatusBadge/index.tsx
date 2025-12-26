import './index.css';

interface FileStatusBadgeProps {
    status: string;
}

export function FileStatusBadge({ status }: FileStatusBadgeProps) {
    const statusMap: Record<string, { label: string; variant: string }> = {
        A: { label: 'A', variant: 'added' },
        M: { label: 'M', variant: 'modified' },
        D: { label: 'D', variant: 'deleted' },
        R: { label: 'R', variant: 'renamed' },
        U: { label: 'U', variant: 'untracked' },
        C: { label: 'C', variant: 'conflict' },
        T: { label: 'T', variant: 'typechange' },
    };

    const { label, variant } = statusMap[status] || {
        label: status || '?',
        variant: 'unknown',
    };

    return <span className={`file-status-badge file-status-badge--${variant}`}>{label}</span>;
}

