'use client';

import React from 'react';
import styles from '@/styles/TabSelector.module.css';

interface TabProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

const TabSelector: React.FC<TabProps> = ({ tabs, activeTab, onTabChange, className = '' }) => {
  return (
    <div className={`${styles.tabContainer} ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tabButton} ${
            activeTab === tab.id
              ? styles.activeTab
              : styles.inactiveTab
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabSelector;
