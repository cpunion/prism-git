import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Input } from './index';

const meta: Meta<typeof Input> = {
    title: 'Common/Input',
    component: Input,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

// 带状态的包装组件
function InputWithState(props: Partial<React.ComponentProps<typeof Input>>) {
    const [value, setValue] = useState('');
    return <Input value={value} onChange={setValue} {...props} />;
}

export const Default: Story = {
    render: () => <InputWithState placeholder="Enter text..." />,
};

export const WithIcon: Story = {
    render: () => (
        <InputWithState
            placeholder="Search..."
            icon={<span>🔍</span>}
        />
    ),
};

export const Disabled: Story = {
    render: () => (
        <InputWithState
            placeholder="Disabled input"
            disabled
        />
    ),
};

export const Password: Story = {
    render: () => (
        <InputWithState
            type="password"
            placeholder="Enter password..."
        />
    ),
};
