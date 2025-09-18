import { GroceryItem, ShoppingListItem } from '../types';

export const demoGroceryItems: GroceryItem[] = [
  {
    id: 'demo-1',
    name: 'Milk',
    category: 'dairy',
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    addedDate: new Date(),
    quantity: 2,
    unit: 'carton'
  },
  {
    id: 'demo-2',
    name: 'Broccoli',
    category: 'vegetables',
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    addedDate: new Date(),
    quantity: 1,
    unit: 'head'
  },
  {
    id: 'demo-3',
    name: 'Chicken Breast',
    category: 'meat',
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    addedDate: new Date(),
    quantity: 4,
    unit: 'piece'
  },
  {
    id: 'demo-4',
    name: 'Apples',
    category: 'fruits',
    expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    addedDate: new Date(),
    quantity: 6,
    unit: 'piece'
  },
  {
    id: 'demo-5',
    name: 'Bread',
    category: 'grains',
    expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    addedDate: new Date(),
    quantity: 1,
    unit: 'loaf'
  }
];

export const demoShoppingItems: ShoppingListItem[] = [
  {
    id: 'demo-shop-1',
    name: 'Eggs',
    category: 'dairy',
    isMustHave: true,
    autoAdd: false
  },
  {
    id: 'demo-shop-2',
    name: 'Carrots',
    category: 'vegetables',
    isMustHave: false,
    autoAdd: false
  },
  {
    id: 'demo-shop-3',
    name: 'Rice',
    category: 'grains',
    isMustHave: true,
    autoAdd: false
  }
];
