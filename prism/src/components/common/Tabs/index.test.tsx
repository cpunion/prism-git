import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from './index';

describe('Tabs', () => {
    const defaultTabs = [
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
    ];

    it('renders all tabs', () => {
        render(<Tabs tabs={defaultTabs} activeTab="tab1" onChange={() => { }} />);
        expect(screen.getByText('Tab 1')).toBeInTheDocument();
        expect(screen.getByText('Tab 2')).toBeInTheDocument();
    });

    it('marks active tab', () => {
        render(<Tabs tabs={defaultTabs} activeTab="tab1" onChange={() => { }} />);
        const activeButton = screen.getByText('Tab 1').closest('button');
        expect(activeButton).toHaveClass('active');
    });

    it('calls onChange when clicking tab', async () => {
        const handleChange = vi.fn();
        const user = userEvent.setup();

        render(<Tabs tabs={defaultTabs} activeTab="tab1" onChange={handleChange} />);
        await user.click(screen.getByText('Tab 2'));

        expect(handleChange).toHaveBeenCalledWith('tab2');
    });

    it('renders tabs with icons', () => {
        const tabsWithIcons = [
            { id: 'tab1', label: 'Tab 1', icon: '📁' },
        ];
        render(<Tabs tabs={tabsWithIcons} activeTab="tab1" onChange={() => { }} />);
        expect(screen.getByText('📁')).toBeInTheDocument();
    });

    it('renders tabs with badges', () => {
        const tabsWithBadges = [
            { id: 'tab1', label: 'Tab 1', badge: 5 },
        ];
        render(<Tabs tabs={tabsWithBadges} activeTab="tab1" onChange={() => { }} />);
        expect(screen.getByText('5')).toBeInTheDocument();
    });
});
