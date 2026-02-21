import type { Meta, StoryObj } from '@storybook/nextjs';
import { TextArea } from './TextArea';

const meta = {
  title: 'Forms/TextArea',
  component: TextArea,
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
    rows: {
      control: 'number',
    },
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: '説明',
    placeholder: '説明を入力してください',
  },
};

export const WithHelperText: Story = {
  args: {
    label: '詳細説明',
    placeholder: 'スポットの詳細を入力してください',
    helperText: '500文字以内で入力してください',
  },
};

export const WithError: Story = {
  args: {
    label: '説明',
    placeholder: '説明を入力してください',
    error: '説明は必須項目です',
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
    label: '無効化されたテキストエリア',
    placeholder: '入力できません',
    disabled: true,
    defaultValue: 'このフィールドは編集できません',
  },
};

export const WithRows: Story = {
  args: {
    label: '詳細コメント',
    placeholder: '詳細なコメントを入力してください',
    rows: 8,
  },
};

export const FullWidth: Story = {
  args: {
    label: '全幅テキストエリア',
    placeholder: '幅いっぱいに広がります',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithLongContent: Story = {
  args: {
    label: '長文コンテンツ',
    defaultValue: `福岡遊び日記は、地元住民しか知らない隠れ家スポットやディープな体験を提案する、福岡の遊び場探しサービスです。

天気や予定に合わせた柔軟なプラン提案で、いつもと違う特別な週末をお過ごしいただけます。

カフェ、レストラン、アクティビティなど様々なカテゴリーから場所を探し、プランを作成・共有することができます。`,
    rows: 6,
  },
};
