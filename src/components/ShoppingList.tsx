import React, { useState } from 'react';
import { ShoppingListItem, CATEGORY_ICONS, CATEGORY_COLORS } from '../types';
import { ShoppingCart, Download, Plus, X } from 'lucide-react';

interface ShoppingListProps {
  items: ShoppingListItem[];
  onAddItem: (item: Omit<ShoppingListItem, 'id'>) => void;
  onRemoveItem: (id: string) => void;
  onToggleMustHave: (id: string) => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({
  items,
  onAddItem,
  onRemoveItem,
  onToggleMustHave,
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'meat' | 'vegetables' | 'dairy' | 'fruits' | 'grains' | 'other'>('other');
  const [showAddForm, setShowAddForm] = useState(false);

  const categories = [
    { value: 'meat', label: 'Meat', icon: CATEGORY_ICONS.meat },
    { value: 'vegetables', label: 'Vegetables', icon: CATEGORY_ICONS.vegetables },
    { value: 'dairy', label: 'Dairy', icon: CATEGORY_ICONS.dairy },
    { value: 'fruits', label: 'Fruits', icon: CATEGORY_ICONS.fruits },
    { value: 'grains', label: 'Grains', icon: CATEGORY_ICONS.grains },
    { value: 'other', label: 'Other', icon: CATEGORY_ICONS.other },
  ];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    onAddItem({
      name: newItemName.trim(),
      category: newItemCategory,
      isMustHave: false,
      autoAdd: false,
    });

    setNewItemName('');
    setNewItemCategory('other');
    setShowAddForm(false);
  };

  const handleRemoveItem = (id: string) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      onRemoveItem(id);
    }
  };

  const mustHaveItems = items.filter(item => item.isMustHave);
  const regularItems = items.filter(item => !item.isMustHave);

  const exportList = () => {
    const listText = items.map(item => 
      `${item.isMustHave ? '⭐ ' : ''}${item.name} (${item.category})`
    ).join('\n');
    
    const blob = new Blob([listText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopping-list.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full px-4 py-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Shopping List</h2>
        <div className="flex space-x-2">
          <button
            onClick={exportList}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center space-x-1"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          {items.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all items from your shopping list?')) {
                  items.forEach(item => onRemoveItem(item.id));
                }
              }}
              className="px-3 py-1 bg-accent-500 text-white rounded-lg text-sm hover:bg-accent-600 transition-colors flex items-center space-x-1"
            >
              <X className="w-4 h-4" />
              <span>Delete All</span>
            </button>
          )}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition-colors flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Add Item Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name
              </label>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter item name..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setNewItemCategory(cat.value as any)}
                    className={`p-2 rounded-lg border-2 transition-colors ${
                      newItemCategory === cat.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <cat.icon className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                      <div className="text-xs font-medium">{cat.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Add Item
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Must-Have Items */}
      {mustHaveItems.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
            <span className="text-yellow-500 mr-2">⭐</span>
            Must-Have Items
          </h3>
          <div className="space-y-2">
            {mustHaveItems.map((item) => (
              <div
                key={item.id}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {React.createElement(CATEGORY_ICONS[item.category], { className: "w-5 h-5 text-gray-600" })}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[item.category]}`}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onToggleMustHave(item.id)}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Items */}
      {regularItems.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Shopping Items</h3>
          <div className="space-y-2">
            {regularItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {React.createElement(CATEGORY_ICONS[item.category], { className: "w-5 h-5 text-gray-600" })}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[item.category]}`}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onToggleMustHave(item.id)}
                      className="text-gray-400 hover:text-yellow-500"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your shopping list is empty</h3>
          <p className="text-gray-500">Add items to get started!</p>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
