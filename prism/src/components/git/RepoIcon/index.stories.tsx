import type { Meta, StoryObj } from '@storybook/react';
import { RepoIcon } from './index';

const meta: Meta<typeof RepoIcon> = {
    title: 'Git/RepoIcon',
    component: RepoIcon,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RepoIcon>;

export const Default: Story = {};

export const Small: Story = {
    args: {
        size: 32,
    },
};

export const Large: Story = {
    args: {
        size: 64,
    },
};
