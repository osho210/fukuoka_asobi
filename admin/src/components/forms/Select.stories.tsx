import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta = {
  title: 'Forms/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
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
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const categoryOptions = [
  { value: 'cafe', label: 'カフェ' },
  { value: 'restaurant', label: 'レストラン' },
  { value: 'bar', label: 'バー' },
  { value: 'activity', label: 'アクティビティ' },
];

const prefectureOptions = [
  { value: 'fukuoka', label: '福岡県' },
  { value: 'saga', label: '佐賀県' },
  { value: 'nagasaki', label: '長崎県' },
  { value: 'kumamoto', label: '熊本県' },
  { value: 'oita', label: '大分県' },
  { value: 'miyazaki', label: '宮崎県' },
  { value: 'kagoshima', label: '鹿児島県' },
];

export const Default: Story = {
  args: {
    label: 'カテゴリ',
    options: categoryOptions,
  },
};

export const WithPlaceholder: Story = {
  args: {
    label: 'カテゴリを選択',
    options: categoryOptions,
    placeholder: 'カテゴリを選んでください',
  },
};

export const WithHelperText: Story = {
  args: {
    label: '都道府県',
    options: prefectureOptions,
    helperText: 'お住まいの都道府県を選択してください',
  },
};

export const WithError: Story = {
  args: {
    label: 'カテゴリ',
    options: categoryOptions,
    error: 'カテゴリを選択してください',
  },
};

export const Required: Story = {
  args: {
    label: '必須選択',
    options: categoryOptions,
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    label: '無効化されたセレクト',
    options: categoryOptions,
    disabled: true,
    value: 'cafe',
  },
};

export const WithDefaultValue: Story = {
  args: {
    label: 'デフォルト値あり',
    options: categoryOptions,
    value: 'restaurant',
  },
};

export const FullWidth: Story = {
  args: {
    label: '全幅セレクト',
    options: prefectureOptions,
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
