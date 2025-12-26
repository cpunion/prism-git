import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tabs } from './index';

const meta: Meta<typeof Tabs> = {
    title: 'Common/Tabs',
    component: Tabs,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

function TabsWithState(props: { tabs: { id: string; label: string; icon?: React.ReactNode; badge?: number }[] }) {
    const [active, setActive] = useState(props.tabs[0].id);
    return <Tabs tabs={props.tabs} activeTab={active} onChange={setActive} />;
}

export const Default: Story = {
    render: () => (
        <TabsWithState
            tabs={[
                { id: 'local', label: 'Local' },
                { id: 'remote', label: 'Remote' },
            ]}
        />
    ),
};

export const WithIcons: Story = {
    render: () => (
        <TabsWithState
            tabs={[
                { id: 'status', label: 'File Status', icon: '📄' },
                { id: 'history', label: 'History', icon: '🕐' },
            ]}
        />
    ),
};

export const WithBadges: Story = {
    render: () => (
        <TabsWithState
            tabs={[
                { id: 'staged', label: 'Staged', badge: 3 },
                { id: 'unstaged', label: 'Unstaged', badge: 12 },
                { id: 'untracked', label: 'Untracked', badge: 0 },
            ]}
        />
    ),
};
