import { ReactNode } from 'react';
import './index.css';

interface Tab {
    id: string;
    label: string;
    icon?: ReactNode;
    badge?: number;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
    return (
        <div className="tabs">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`tabs__item ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onChange(tab.id)}
                >
                    {tab.icon && <span className="tabs__icon">{tab.icon}</span>}
                    <span className="tabs__label">{tab.label}</span>
                    {tab.badge !== undefined && tab.badge > 0 && (
                        <span className="tabs__badge">{tab.badge}</span>
                    )}
                </button>
            ))}
        </div>
    );
}
