import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from './TextField';

const meta = {
  title: 'Forms/TextField',
  component: TextField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'time'],
    },
    fullWidth: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'テキストフィールド',
    placeholder: 'テキストを入力してください',
  },
};

export const WithHelperText: Story = {
  args: {
    label: '名前',
    placeholder: '例: 山田太郎',
    helperText: '姓と名をスペースなしで入力してください',
  },
};

export const WithError: Story = {
  args: {
    label: 'メールアドレス',
    type: 'email',
    placeholder: 'example@email.com',
    error: '有効なメールアドレスを入力してください',
    defaultValue: 'invalid-email',
  },
};

export const Required: Story = {
  args: {
    label: '必須項目',
    placeholder: '必ず入力してください',
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    label: '無効化されたフィールド',
    placeholder: '入力できません',
    disabled: true,
    defaultValue: '変更不可',
  },
};

export const Password: Story = {
  args: {
    label: 'パスワード',
    type: 'password',
    placeholder: 'パスワードを入力',
  },
};

export const Number: Story = {
  args: {
    label: '数量',
    type: 'number',
    placeholder: '0',
    helperText: '1以上の数値を入力してください',
  },
};

export const FullWidth: Story = {
  args: {
    label: '全幅フィールド',
    placeholder: '幅いっぱいに広がります',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};
