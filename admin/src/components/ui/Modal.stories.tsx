import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { Modal } from './Modal';

const meta = {
  title: 'UI/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    isOpen: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: '小さいモーダル',
    size: 'sm',
    children: <p>これは小さいサイズのモーダルです。確認ダイアログなどに適しています。</p>,
  },
};

export const Medium: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: '中サイズモーダル',
    size: 'md',
    children: (
      <div>
        <p>これは中サイズのモーダルです。フォームやコンテンツ表示に適しています。</p>
        <p className="mt-4">複数の段落を含むこともできます。</p>
      </div>
    ),
  },
};

export const Large: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: '大きいモーダル',
    size: 'lg',
    children: (
      <div>
        <p>これは大きいサイズのモーダルです。詳細情報やテーブルの表示に適しています。</p>
        <ul className="mt-4 list-disc list-inside">
          <li>項目1</li>
          <li>項目2</li>
          <li>項目3</li>
        </ul>
      </div>
    ),
  },
};

export const ExtraLarge: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: '特大モーダル',
    size: 'xl',
    children: (
      <div>
        <p>これは特大サイズのモーダルです。複雑なフォームやダッシュボードに適しています。</p>
      </div>
    ),
  },
};

// インタラクティブなストーリー
const InteractiveModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="p-4">
      <button
        className="btn btn-default"
        onClick={() => setIsOpen(true)}
      >
        モーダルを開く
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="インタラクティブモーダル"
        size="md"
      >
        <p>ボタンをクリックしてモーダルを閉じることができます。</p>
        <div className="mt-4 flex justify-end">
          <button
            className="btn btn-default"
            onClick={() => setIsOpen(false)}
          >
            閉じる
          </button>
        </div>
      </Modal>
    </div>
  );
};

export const Interactive: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    title: 'インタラクティブモーダル',
    size: 'md',
    children: <p>ボタンをクリックしてモーダルを閉じることができます。</p>,
  },
  render: () => <InteractiveModal />,
};
