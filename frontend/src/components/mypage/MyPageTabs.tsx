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
      <div className={styles['mypage-tabs-container']}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles['mypage-tab-button']} ${
              activeTab === tab.id
                ? styles['mypage-tab-active']
                : styles['mypage-tab-inactive']
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles['mypage-tab-content']}>
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default MyPageTabs;
