import { 
  Beef, 
  Carrot, 
  Milk, 
  Apple, 
  Wheat, 
  Package 
} from 'lucide-react';

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

export const CATEGORY_ICONS: Record<GroceryCategory, React.ComponentType<any>> = {
  meat: Beef,
  vegetables: Carrot,
  dairy: Milk,
  fruits: Apple,
  grains: Wheat,
  other: Package
};

export const CATEGORY_COLORS: Record<GroceryCategory, string> = {
  meat: 'bg-accent-100 text-accent-800',
  vegetables: 'bg-primary-100 text-primary-800',
  dairy: 'bg-blue-100 text-blue-800',
  fruits: 'bg-secondary-100 text-secondary-800',
  grains: 'bg-amber-100 text-amber-800',
  other: 'bg-gray-100 text-gray-800'
};
