import type { Meta, StoryObj } from '@storybook/react';
import { BranchBadge } from './index';

const meta: Meta<typeof BranchBadge> = {
    title: 'Git/BranchBadge',
    component: BranchBadge,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BranchBadge>;

export const Main: Story = {
    args: {
        branch: 'main',
    },
};

export const Feature: Story = {
    args: {
        branch: 'feature/new-ui',
    },
};

export const LongName: Story = {
    args: {
        branch: 'feature/very-long-branch-name',
    },
};
