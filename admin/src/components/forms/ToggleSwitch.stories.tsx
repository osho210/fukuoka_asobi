import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { ToggleSwitch } from './ToggleSwitch';

const meta = {
  title: 'Forms/ToggleSwitch',
  component: ToggleSwitch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof ToggleSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: '通知を有効にする',
  },
};

export const Checked: Story = {
  args: {
    label: '有効',
    checked: true,
  },
};

export const Unchecked: Story = {
  args: {
    label: '無効',
    checked: false,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'メール通知',
    helperText: '新着情報をメールでお知らせします',
  },
};

export const WithError: Story = {
  args: {
    label: '利用規約に同意する',
    error: '利用規約への同意が必要です',
  },
};

export const Required: Story = {
  args: {
    label: '必須同意項目',
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    label: '無効化されたスイッチ',
    disabled: true,
    checked: true,
  },
};

// インタラクティブなストーリー
const InteractiveToggle = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  return (
    <div className="space-y-4">
      <ToggleSwitch
        label={isEnabled ? '機能: 有効' : '機能: 無効'}
        checked={isEnabled}
        onChange={setIsEnabled}
        helperText="クリックして切り替えてください"
      />
      <p className="text-sm text-gray-600">
        現在の状態: {isEnabled ? 'ON' : 'OFF'}
      </p>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveToggle />,
};
