import React from 'react';

interface HeaderProps {
  activeTab: 'garage' | 'winners';
  onTabChange: (tab: 'garage' | 'winners') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="bg-grey-900 border-b-2 border-purple-500">
      <div className="max-w-7xl mx-auto px-4 py-7">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-purple-400">
            ASYNC RACE
          </h1>
          <nav className="flex space-x-4">
            <button
              onClick={() => onTabChange('garage')}
              className={`px-6 py-3 rounded-lg font-semibold ${
                activeTab === 'garage'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              GARAGE
            </button>
            <button
              onClick={() => onTabChange('winners')}
              className={`px-6 py-3 rounded-lg font-semibold ${
                activeTab === 'winners'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              WINNERS
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};