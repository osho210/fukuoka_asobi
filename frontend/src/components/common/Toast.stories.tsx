import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';

const meta = {
  title: 'Common/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'error', 'info', 'warning'],
    },
    duration: {
      control: 'number',
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    message: '操作が成功しました',
    type: 'success',
    duration: 10000,
  },
};

export const Error: Story = {
  args: {
    message: 'エラーが発生しました',
    type: 'error',
    duration: 10000,
  },
};

export const Info: Story = {
  args: {
    message: 'お知らせがあります',
    type: 'info',
    duration: 10000,
  },
};

export const Warning: Story = {
  args: {
    message: '注意が必要です',
    type: 'warning',
    duration: 10000,
  },
};
