import { ReactNode } from 'react';
import './index.css';

interface SidebarProps {
    children: ReactNode;
    width?: number;
    className?: string;
}

interface SidebarSectionProps {
    title?: string;
    children: ReactNode;
}

interface SidebarItemProps {
    icon?: ReactNode;
    label: string;
    badge?: number;
    active?: boolean;
    onClick?: () => void;
}

export function Sidebar({ children, width = 200, className = '' }: SidebarProps) {
    return (
        <div className={`sidebar ${className}`} style={{ width }}>
            {children}
        </div>
    );
}

export function SidebarSection({ title, children }: SidebarSectionProps) {
    return (
        <div className="sidebar-section">
            {title && <div className="sidebar-section__title">{title}</div>}
            <div className="sidebar-section__content">{children}</div>
        </div>
    );
}

export function SidebarItem({ icon, label, badge, active = false, onClick }: SidebarItemProps) {
    return (
        <div
            className={`sidebar-item ${active ? 'active' : ''}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
        >
            {icon && <span className="sidebar-item__icon">{icon}</span>}
            <span className="sidebar-item__label">{label}</span>
            {badge !== undefined && badge > 0 && (
                <span className="sidebar-item__badge">{badge}</span>
            )}
        </div>
    );
}
