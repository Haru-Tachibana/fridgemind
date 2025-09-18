import React, { useState, useEffect } from 'react';
import { GroceryItem, ShoppingListItem } from './types';
import { storage } from './utils/storage';
import { NotificationService } from './services/notifications';
import Header from './components/Header';
import Navigation from './components/Navigation';
import FridgeInventory from './components/FridgeInventory';
import RecipeSuggestions from './components/RecipeSuggestions';
import ShoppingList from './components/ShoppingList';
import AddItemModal from './components/AddItemModal';
import Settings from './components/Settings';
import Toast from './components/Toast';

type TabType = 'fridge' | 'recipes' | 'shopping';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('fridge');
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Load data on component mount
  useEffect(() => {
    setGroceryItems(storage.getGroceryItems());
    setShoppingList(storage.getShoppingList());
  }, []);

  // Check for notifications when data changes
  useEffect(() => {
    const notificationService = NotificationService.getInstance();
    const settings = storage.getNotificationSettings();
    
    if (settings.enablePushNotifications) {
      notificationService.checkExpiringItems(groceryItems, settings.expiryWarningDays);
      notificationService.checkLowStock(groceryItems, shoppingList, settings.lowStockThreshold);
    }
  }, [groceryItems, shoppingList]);

  // Save data whenever it changes
  useEffect(() => {
    storage.saveGroceryItems(groceryItems);
  }, [groceryItems]);

  useEffect(() => {
    storage.saveShoppingList(shoppingList);
  }, [shoppingList]);

  const addGroceryItem = (item: Omit<GroceryItem, 'id'>) => {
    const newItem: GroceryItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
    };
    setGroceryItems(prev => [...prev, newItem]);
    setToast({ message: `${item.name} added to fridge!`, type: 'success' });
  };

  const removeGroceryItem = (id: string) => {
    setGroceryItems(prev => prev.filter(item => item.id !== id));
  };

  const addShoppingListItem = (item: Omit<ShoppingListItem, 'id'>) => {
    const newItem: ShoppingListItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
    };
    setShoppingList(prev => [...prev, newItem]);
    setToast({ message: `${item.name} added to shopping list!`, type: 'success' });
  };

  const removeShoppingListItem = (id: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
  };

  const toggleShoppingListItem = (id: string) => {
    setShoppingList(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isMustHave: !item.isMustHave } : item
      )
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'fridge':
        return (
          <FridgeInventory
            items={groceryItems}
            onRemoveItem={removeGroceryItem}
          />
        );
      case 'recipes':
        return <RecipeSuggestions items={groceryItems} />;
      case 'shopping':
        return (
          <ShoppingList
            items={shoppingList}
            onAddItem={addShoppingListItem}
            onRemoveItem={removeShoppingListItem}
            onToggleMustHave={toggleShoppingListItem}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300">
      <Header onSettingsClick={() => setShowSettings(true)} />
      <main className="pb-20 w-full animate-fadeIn">
        {renderActiveTab()}
      </main>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-full shadow-lg flex items-center justify-center z-40 transition-all duration-300 hover:scale-110 hover:shadow-xl animate-bounceIn"
      >
        <svg className="w-6 h-6 transition-transform duration-200 hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Add Item Modal */}
      {showAddModal && (
        <AddItemModal
          onClose={() => setShowAddModal(false)}
          onAddGroceryItem={addGroceryItem}
          onAddShoppingItem={addShoppingListItem}
          activeTab={activeTab}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <Settings 
          onClose={() => setShowSettings(false)}
          onLoadDemoData={() => {
            setGroceryItems(storage.getGroceryItems());
            setShoppingList(storage.getShoppingList());
          }}
        />
      )}

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
