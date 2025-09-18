import React, { useState } from 'react';
import { GroceryItem, ShoppingListItem, GroceryCategory } from '../types';
import { categorizeItem, estimateExpiryDate } from '../utils/helpers';

type TabType = 'fridge' | 'recipes' | 'shopping';

interface AddItemModalProps {
  onClose: () => void;
  onAddGroceryItem: (item: Omit<GroceryItem, 'id'>) => void;
  onAddShoppingItem: (item: Omit<ShoppingListItem, 'id'>) => void;
  activeTab: TabType;
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  onClose,
  onAddGroceryItem,
  onAddShoppingItem,
  activeTab,
}) => {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<GroceryCategory>('other');
  const [expiryDate, setExpiryDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('piece');
  const [isMustHave, setIsMustHave] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const categories: { value: GroceryCategory; label: string; icon: string }[] = [
    { value: 'meat', label: 'Meat', icon: '🥩' },
    { value: 'vegetables', label: 'Vegetables', icon: '🥦' },
    { value: 'dairy', label: 'Dairy', icon: '🥛' },
    { value: 'fruits', label: 'Fruits', icon: '🍎' },
    { value: 'grains', label: 'Grains', icon: '🌾' },
    { value: 'other', label: 'Other', icon: '📦' },
  ];

  const units = ['piece', 'kg', 'g', 'lb', 'oz', 'liter', 'ml', 'cup', 'tbsp', 'tsp'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!itemName.trim()) return;

    if (activeTab === 'fridge') {
      onAddGroceryItem({
        name: itemName.trim(),
        category,
        expiryDate: expiryDate ? new Date(expiryDate) : estimateExpiryDate(itemName, category),
        addedDate: new Date(),
        quantity,
        unit,
      });
    } else {
      onAddShoppingItem({
        name: itemName.trim(),
        category,
        isMustHave,
        autoAdd: false,
      });
    }

    // Reset form
    setItemName('');
    setCategory('other');
    setExpiryDate('');
    setQuantity(1);
    setUnit('piece');
    setIsMustHave(false);
    onClose();
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input is not supported in this browser');
      return;
    }

    setIsRecording(true);
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setItemName(transcript);
      setCategory(categorizeItem(transcript));
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="bg-white rounded-t-2xl w-full max-w-md mx-auto max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Add {activeTab === 'fridge' ? 'Grocery Item' : 'Shopping Item'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Item Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter item name..."
                  required
                />
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  disabled={isRecording}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    isRecording
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isRecording ? '🎤' : '🎤'}
                </button>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      category === cat.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{cat.icon}</div>
                      <div className="text-xs font-medium">{cat.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Unit (for fridge items) */}
            {activeTab === 'fridge' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {units.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Expiry Date (for fridge items) */}
            {activeTab === 'fridge' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to auto-estimate based on item type
                </p>
              </div>
            )}

            {/* Must Have (for shopping items) */}
            {activeTab === 'shopping' && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="mustHave"
                  checked={isMustHave}
                  onChange={(e) => setIsMustHave(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="mustHave" className="ml-2 text-sm text-gray-700">
                  Must-have item (auto-add when low)
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Add Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
