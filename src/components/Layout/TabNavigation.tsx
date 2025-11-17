/**
 * Компонент навигации по табам
 */

import React from 'react';

export type Tab = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-3
                font-medium transition-all duration-200
                border-b-2 whitespace-nowrap
                ${
                  isActive
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
