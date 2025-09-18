import React from 'react';

interface HeaderProps {
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">FridgeMind</h1>
          </div>
          <button
            onClick={onSettingsClick}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0l1.403 5.784c.42 1.73-.746 3.299-2.5 3.299H11.5c-1.754 0-2.92-1.569-2.5-3.299l1.403-5.784zM18 8l-2 2m0 0l-2-2m2 2l2-2m-2 2l-2 2m0 0l2 2m-2-2l2-2" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
