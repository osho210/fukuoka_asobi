'use client';

import React, { ReactNode } from 'react';
import '@/styles/MyPageTabs.css';

interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface MyPageTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

const MyPageTabs: React.FC<MyPageTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = ''
}) => {
  return (
    <div className={className}>
      <div className={'mypage-tabs-container'}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${'mypage-tab-button'} ${activeTab === tab.id
                ? 'mypage-tab-active'
                : 'mypage-tab-inactive'
              }`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={'mypage-tab-content'}>
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default MyPageTabs;
