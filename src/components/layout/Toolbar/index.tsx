import { ReactNode } from 'react';
import './index.css';

interface ToolbarProps {
    children: ReactNode;
    className?: string;
}

interface ToolbarGroupProps {
    children: ReactNode;
    align?: 'left' | 'center' | 'right';
}

interface ToolbarDividerProps { }

export function Toolbar({ children, className = '' }: ToolbarProps) {
    return (
        <div className={`toolbar ${className}`}>
            {children}
        </div>
    );
}

export function ToolbarGroup({ children, align = 'left' }: ToolbarGroupProps) {
    return (
        <div className={`toolbar__group toolbar__group--${align}`}>
            {children}
        </div>
    );
}

export function ToolbarDivider({ }: ToolbarDividerProps) {
    return <div className="toolbar__divider" />;
}
