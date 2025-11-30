import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import TabSelector from './TabSelector';

const meta = {
  title: 'Common/TabSelector',
  component: TabSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TabSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleTabs = [
  { id: 'tab1', label: 'タブ1' },
  { id: 'tab2', label: 'タブ2' },
  { id: 'tab3', label: 'タブ3' },
];

export const Default: Story = {
  args: {
    tabs: sampleTabs,
    activeTab: 'tab1',
    onTabChange: () => {},
  },
};

export const SecondTabActive: Story = {
  args: {
    tabs: sampleTabs,
    activeTab: 'tab2',
    onTabChange: () => {},
  },
};

export const ManyTabs: Story = {
  args: {
    tabs: [
      { id: 'home', label: 'ホーム' },
      { id: 'spots', label: 'スポット' },
      { id: 'events', label: 'イベント' },
      { id: 'news', label: 'ニュース' },
      { id: 'mypage', label: 'マイページ' },
    ],
    activeTab: 'home',
    onTabChange: () => {},
  },
};

// インタラクティブなストーリー
const InteractiveTabSelector = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  return (
    <TabSelector
      tabs={sampleTabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
};

export const Interactive: Story = {
  args: {
    tabs: sampleTabs,
    activeTab: 'tab1',
    onTabChange: () => {},
  },
  render: () => <InteractiveTabSelector />,
};
