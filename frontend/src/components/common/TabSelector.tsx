'use client';

import React from 'react';
import '@/styles/TabSelector.css';

interface TabProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

const TabSelector: React.FC<TabProps> = ({ tabs, activeTab, onTabChange, className = '' }) => {
  return (
    <div className={`tabContainer ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tabButton ${
            activeTab === tab.id ? "activeTab" : "inactiveTab"
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
