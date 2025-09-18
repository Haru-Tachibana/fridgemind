import { GroceryItem, ShoppingListItem, NotificationSettings } from '../types';

const STORAGE_KEYS = {
  GROCERY_ITEMS: 'fridgemind_grocery_items',
  SHOPPING_LIST: 'fridgemind_shopping_list',
  NOTIFICATION_SETTINGS: 'fridgemind_notification_settings',
} as const;

export const storage = {
  // Grocery Items
  getGroceryItems: (): GroceryItem[] => {
    try {
      const items = localStorage.getItem(STORAGE_KEYS.GROCERY_ITEMS);
      if (!items) return [];
      return JSON.parse(items).map((item: any) => ({
        ...item,
        expiryDate: new Date(item.expiryDate),
        addedDate: new Date(item.addedDate),
      }));
    } catch (error) {
      console.error('Error loading grocery items:', error);
      return [];
    }
  },

  saveGroceryItems: (items: GroceryItem[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.GROCERY_ITEMS, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving grocery items:', error);
    }
  },

  // Shopping List
  getShoppingList: (): ShoppingListItem[] => {
    try {
      const items = localStorage.getItem(STORAGE_KEYS.SHOPPING_LIST);
      if (!items) return [];
      return JSON.parse(items).map((item: any) => ({
        ...item,
        lastPurchased: item.lastPurchased ? new Date(item.lastPurchased) : undefined,
      }));
    } catch (error) {
      console.error('Error loading shopping list:', error);
      return [];
    }
  },

  saveShoppingList: (items: ShoppingListItem[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving shopping list:', error);
    }
  },

  // Notification Settings
  getNotificationSettings: (): NotificationSettings => {
    try {
      const settings = localStorage.getItem(STORAGE_KEYS.NOTIFICATION_SETTINGS);
      if (!settings) {
        return {
          expiryWarningDays: 3,
          lowStockThreshold: 1,
          enablePushNotifications: false,
        };
      }
      return JSON.parse(settings);
    } catch (error) {
      console.error('Error loading notification settings:', error);
      return {
        expiryWarningDays: 3,
        lowStockThreshold: 1,
        enablePushNotifications: false,
      };
    }
  },

  saveNotificationSettings: (settings: NotificationSettings): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  },
};
