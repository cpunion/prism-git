import type { Meta, StoryObj } from '@storybook/react';
import { FileStatusBadge } from './index';

const meta: Meta<typeof FileStatusBadge> = {
    title: 'Git/FileStatusBadge',
    component: FileStatusBadge,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FileStatusBadge>;

export const Added: Story = {
    args: {
        status: 'A',
    },
};

export const Modified: Story = {
    args: {
        status: 'M',
    },
};

export const Deleted: Story = {
    args: {
        status: 'D',
    },
};

export const Renamed: Story = {
    args: {
        status: 'R',
    },
};

export const AllStatuses: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '8px' }}>
            <FileStatusBadge status="A" />
            <FileStatusBadge status="M" />
            <FileStatusBadge status="D" />
            <FileStatusBadge status="R" />
        </div>
    ),
};
