export interface GroceryItem {
  id: string;
  name: string;
  category: GroceryCategory;
  expiryDate: Date;
  addedDate: Date;
  quantity: number;
  unit: string;
}

export type GroceryCategory = 'meat' | 'vegetables' | 'dairy' | 'fruits' | 'grains' | 'other';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  tags: string[];
  missingIngredients?: string[];
}

export interface ShoppingListItem {
  id: string;
  name: string;
  category: GroceryCategory;
  isMustHave: boolean;
  autoAdd: boolean;
  lastPurchased?: Date;
}

export interface NotificationSettings {
  expiryWarningDays: number;
  lowStockThreshold: number;
  enablePushNotifications: boolean;
}

export const CATEGORY_ICONS: Record<GroceryCategory, string> = {
  meat: '🥩',
  vegetables: '🥦',
  dairy: '🥛',
  fruits: '🍎',
  grains: '🌾',
  other: '📦'
};

export const CATEGORY_COLORS: Record<GroceryCategory, string> = {
  meat: 'bg-red-100 text-red-800',
  vegetables: 'bg-green-100 text-green-800',
  dairy: 'bg-blue-100 text-blue-800',
  fruits: 'bg-yellow-100 text-yellow-800',
  grains: 'bg-amber-100 text-amber-800',
  other: 'bg-gray-100 text-gray-800'
};
