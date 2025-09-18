import React, { useState, useEffect } from 'react';
import { NotificationSettings } from '../types';
import { storage } from '../utils/storage';
import { NotificationService } from '../services/notifications';
import { demoGroceryItems, demoShoppingItems } from '../data/demoData';

interface SettingsProps {
  onClose: () => void;
  onLoadDemoData?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose, onLoadDemoData }) => {
  const [settings, setSettings] = useState<NotificationSettings>({
    expiryWarningDays: 3,
    lowStockThreshold: 1,
    enablePushNotifications: false,
  });

  useEffect(() => {
    setSettings(storage.getNotificationSettings());
  }, []);

  const handleSave = () => {
    storage.saveNotificationSettings(settings);
    onClose();
  };

  const handleNotificationToggle = async () => {
    if (!settings.enablePushNotifications) {
      const notificationService = NotificationService.getInstance();
      if (!notificationService.isPermissionGranted()) {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          alert('Please enable notifications in your browser settings');
          return;
        }
      }
    }
    setSettings(prev => ({ ...prev, enablePushNotifications: !prev.enablePushNotifications }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="bg-white rounded-t-2xl w-full max-w-md mx-auto max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Notifications Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Push Notifications</h4>
                    <p className="text-sm text-gray-500">Get notified about expiring items and low stock</p>
                  </div>
                  <button
                    onClick={handleNotificationToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.enablePushNotifications ? 'bg-primary-500' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.enablePushNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Warning (days before)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={settings.expiryWarningDays}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      expiryWarningDays: Number(e.target.value) 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={settings.lowStockThreshold}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      lowStockThreshold: Number(e.target.value) 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Data Management Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    if (window.confirm('This will load demo data to help you get started. Continue?')) {
                      storage.saveGroceryItems(demoGroceryItems);
                      storage.saveShoppingList(demoShoppingItems);
                      if (onLoadDemoData) {
                        onLoadDemoData();
                      }
                      window.location.reload();
                    }
                  }}
                  className="w-full px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                >
                  Load Demo Data
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('This will export all your data as a JSON file. Continue?')) {
                      const data = {
                        groceryItems: storage.getGroceryItems(),
                        shoppingList: storage.getShoppingList(),
                        settings: storage.getNotificationSettings(),
                        exportDate: new Date().toISOString(),
                      };
                      
                      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `fridgemind-backup-${new Date().toISOString().split('T')[0]}.json`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }
                  }}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Export Data
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('This will clear all your data. This action cannot be undone. Continue?')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Clear All Data
                </button>
              </div>
            </div>

            {/* About Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">About</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>FridgeMind v1.0.0</strong></p>
                <p>A minimalistic web app to help you track groceries, reduce food waste, and get recipe suggestions.</p>
                <p>Built with React, TypeScript, and Tailwind CSS.</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-8">
            <button
              onClick={handleSave}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Save Settings
            </button>
            <button
              onClick={onClose}
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

export default Settings;
