import React from 'react';
import { Refrigerator, ChefHat, ShoppingCart } from 'lucide-react';

type TabType = 'fridge' | 'recipes' | 'shopping';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'fridge' as TabType, label: 'Fridge', icon: Refrigerator },
    { id: 'recipes' as TabType, label: 'Recipes', icon: ChefHat },
    { id: 'shopping' as TabType, label: 'Shopping', icon: ShoppingCart },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
      <div className="w-full">
        <div className="flex">
          {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex-1 flex flex-col items-center py-3 px-2 transition-colors ${
                    activeTab === tab.id
                      ? 'text-white bg-primary-600 shadow-lg'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
              <tab.icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
