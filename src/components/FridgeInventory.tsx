import React, { useState } from 'react';
import { GroceryItem, CATEGORY_ICONS, CATEGORY_COLORS } from '../types';
import { formatDate, getDaysUntilExpiry, getExpiryStatus, getExpiryStatusColor } from '../utils/helpers';
import { Refrigerator, Plus, Minus, Trash2 } from 'lucide-react';

interface FridgeInventoryProps {
  items: GroceryItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const FridgeInventory: React.FC<FridgeInventoryProps> = ({ items, onRemoveItem, onUpdateQuantity }) => {
  const [sortBy, setSortBy] = useState<'expiry' | 'category' | 'name'>('expiry');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['all', 'meat', 'vegetables', 'dairy', 'fruits', 'grains', 'other'];

  const sortedAndFilteredItems = items
    .filter(item => filterCategory === 'all' || item.category === filterCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'expiry':
          return a.expiryDate.getTime() - b.expiryDate.getTime();
        case 'category':
          return a.category.localeCompare(b.category);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });


  if (items.length === 0) {
    return (
      <div className="w-full px-4 py-8">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Refrigerator className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your fridge is empty</h3>
          <p className="text-gray-500">Add some groceries to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6">
      {/* Filters and Sort */}
      <div className="mb-6 space-y-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterCategory === category
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'expiry' | 'category' | 'name')}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="expiry">Expiry Date</option>
            <option value="category">Category</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {sortedAndFilteredItems.map((item, index) => {
          const expiryStatus = getExpiryStatus(item.expiryDate);
          const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
          
          return (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300 animate-slideUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {React.createElement(CATEGORY_ICONS[item.category], { className: "w-5 h-5 text-gray-600" })}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[item.category]}`}>
                          {item.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${getExpiryStatusColor(expiryStatus)}`}>
                        {expiryStatus === 'expired' 
                          ? 'Expired' 
                          : expiryStatus === 'expiring' 
                          ? `Expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}`
                          : `Expires ${formatDate(item.expiryDate)}`
                        }
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-2 py-1 text-sm font-medium text-gray-700 min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Remove all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FridgeInventory;
