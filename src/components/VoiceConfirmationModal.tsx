import React from 'react';
import { ParsedItem } from '../utils/voiceParser';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../types';
import { X, Check, Edit } from 'lucide-react';

interface VoiceConfirmationModalProps {
  items: ParsedItem[];
  onConfirm: (items: ParsedItem[]) => void;
  onCancel: () => void;
  onEditItem: (index: number, item: ParsedItem) => void;
  activeTab: 'fridge' | 'recipes' | 'shopping';
}

const VoiceConfirmationModal: React.FC<VoiceConfirmationModalProps> = ({
  items,
  onConfirm,
  onCancel,
  onEditItem,
  activeTab,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto animate-bounceIn">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Confirm Voice Input
            </h2>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              I found {items.length} item{items.length !== 1 ? 's' : ''} in your voice input. 
              Please review and confirm before adding to your {activeTab === 'fridge' ? 'fridge' : 'shopping list'}.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {items.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {React.createElement(CATEGORY_ICONS[item.category], { 
                        className: "w-5 h-5 text-gray-600" 
                      })}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[item.category]}`}>
                          {item.category}
                        </span>
                        {activeTab === 'fridge' && (
                          <span className="text-sm text-gray-500">
                            {item.quantity} {item.unit}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onEditItem(index, item)}
                    className="p-2 text-gray-400 hover:text-primary-500 rounded-full hover:bg-primary-50 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => onConfirm(items)}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Check className="w-5 h-5" />
              <span>Add All Items</span>
            </button>
            <button
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceConfirmationModal;
