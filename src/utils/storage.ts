import { GroceryItem, ShoppingListItem, NotificationSettings } from '../types';

const STORAGE_KEYS = {
  GROCERY_ITEMS: 'fridgemind_grocery_items',
  SHOPPING_LIST: 'fridgemind_shopping_list',
  NOTIFICATION_SETTINGS: 'fridgemind_notification_settings',
} as const;

const getStorageKey = (baseKey: string, userId?: string): string => {
  return userId ? `${baseKey}_${userId}` : baseKey;
};

export const storage = {
  // Grocery Items
  getGroceryItems: (userId?: string): GroceryItem[] => {
    try {
      const key = getStorageKey(STORAGE_KEYS.GROCERY_ITEMS, userId);
      const items = localStorage.getItem(key);
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

  saveGroceryItems: (items: GroceryItem[], userId?: string): void => {
    try {
      const key = getStorageKey(STORAGE_KEYS.GROCERY_ITEMS, userId);
      localStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving grocery items:', error);
    }
  },

  // Shopping List
  getShoppingList: (userId?: string): ShoppingListItem[] => {
    try {
      const key = getStorageKey(STORAGE_KEYS.SHOPPING_LIST, userId);
      const items = localStorage.getItem(key);
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

  saveShoppingList: (items: ShoppingListItem[], userId?: string): void => {
    try {
      const key = getStorageKey(STORAGE_KEYS.SHOPPING_LIST, userId);
      localStorage.setItem(key, JSON.stringify(items));
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
