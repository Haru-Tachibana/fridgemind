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
  meat: 'bg-red-100 text-red-800 border-red-200',
  vegetables: 'bg-green-100 text-green-800 border-green-200',
  dairy: 'bg-tertiary-100 text-tertiary-800 border-tertiary-200',
  fruits: 'bg-orange-100 text-orange-800 border-orange-200',
  grains: 'bg-secondary-100 text-secondary-800 border-secondary-200',
  other: 'bg-purple-100 text-purple-800 border-purple-200'
};
