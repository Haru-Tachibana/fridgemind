import React, { useState, useEffect } from 'react';
import { GroceryItem, ShoppingListItem } from './types';
import { storage } from './utils/storage';
import { NotificationService } from './services/notifications';
import AuthService, { User } from './services/auth';
import Header from './components/Header';
import Navigation from './components/Navigation';
import FridgeInventory from './components/FridgeInventory';
// The following imports are commented out due to missing modules or type declarations.
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication and load user data
  useEffect(() => {
    const authService = AuthService.getInstance();
    const authState = authService.getState();
    
    if (authState.isAuthenticated && authState.user) {
      setUser(authState.user);
      // Load user-specific data
      setGroceryItems(storage.getGroceryItems(authState.user.id));
      setShoppingList(storage.getShoppingList(authState.user.id));
    } else {
      // Load demo data for non-authenticated users
      setGroceryItems(storage.getGroceryItems());
      setShoppingList(storage.getShoppingList());
    }
    
    setIsLoading(false);

    // Subscribe to auth state changes
    const unsubscribe = authService.subscribe((newState) => {
      if (newState.isAuthenticated && newState.user) {
        setUser(newState.user);
        setGroceryItems(storage.getGroceryItems(newState.user.id));
        setShoppingList(storage.getShoppingList(newState.user.id));
      } else {
        setUser(null);
        setGroceryItems(storage.getGroceryItems());
        setShoppingList(storage.getShoppingList());
      }
    });

    return unsubscribe;
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
    storage.saveGroceryItems(groceryItems, user?.id);
  }, [groceryItems, user?.id]);

  useEffect(() => {
    storage.saveShoppingList(shoppingList, user?.id);
  }, [shoppingList, user?.id]);

  const addGroceryItem = (item: Omit<GroceryItem, 'id'>) => {
    setGroceryItems(prev => {
      // Check if there's an existing item with the same name and expiry date
      const existingItemIndex = prev.findIndex(existingItem => 
        existingItem.name.toLowerCase() === item.name.toLowerCase() &&
        existingItem.expiryDate.getTime() === item.expiryDate.getTime()
      );
      
      if (existingItemIndex !== -1) {
        // Merge with existing item by adding quantities
        const updatedItems = [...prev];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity
        };
        setToast({ message: `${item.name} quantity updated to ${updatedItems[existingItemIndex].quantity}!`, type: 'success' });
        return updatedItems;
      } else {
        // Add new item
        const newItem: GroceryItem = {
          ...item,
          id: Math.random().toString(36).substr(2, 9),
        };
        setToast({ message: `${item.name} added to fridge!`, type: 'success' });
        return [...prev, newItem];
      }
    });
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-primary-600 font-bold text-2xl">F</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading FridgeMind...</h2>
          <p className="text-gray-600">Setting up your smart fridge assistant</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300">
      <Header 
        onSettingsClick={() => setShowSettings(true)} 
        user={user}
        onUserChange={setUser}
      />
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
