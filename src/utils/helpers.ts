import { differenceInDays, isAfter, isBefore, addDays } from 'date-fns';
import { GroceryCategory } from '../types';

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getDaysUntilExpiry = (expiryDate: Date): number => {
  const today = new Date();
  return differenceInDays(expiryDate, today);
};

export const isExpiringSoon = (expiryDate: Date, warningDays: number = 3): boolean => {
  const today = new Date();
  const warningDate = addDays(today, warningDays);
  return isBefore(expiryDate, warningDate) && isAfter(expiryDate, today);
};

export const isExpired = (expiryDate: Date): boolean => {
  const today = new Date();
  return isBefore(expiryDate, today);
};

export const getExpiryStatus = (expiryDate: Date, warningDays: number = 3): 'fresh' | 'expiring' | 'expired' => {
  if (isExpired(expiryDate)) return 'expired';
  if (isExpiringSoon(expiryDate, warningDays)) return 'expiring';
  return 'fresh';
};

export const getExpiryStatusColor = (status: 'fresh' | 'expiring' | 'expired'): string => {
  switch (status) {
    case 'fresh':
      return 'text-green-600';
    case 'expiring':
      return 'text-yellow-600';
    case 'expired':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

export const categorizeItem = (itemName: string): GroceryCategory => {
  const name = itemName.toLowerCase();
  
  if (name.includes('milk') || name.includes('cheese') || name.includes('yogurt') || name.includes('butter')) {
    return 'dairy';
  }
  if (name.includes('beef') || name.includes('chicken') || name.includes('pork') || name.includes('fish') || name.includes('meat')) {
    return 'meat';
  }
  if (name.includes('broccoli') || name.includes('carrot') || name.includes('lettuce') || name.includes('spinach') || name.includes('vegetable')) {
    return 'vegetables';
  }
  if (name.includes('apple') || name.includes('banana') || name.includes('orange') || name.includes('berry') || name.includes('fruit')) {
    return 'fruits';
  }
  if (name.includes('bread') || name.includes('rice') || name.includes('pasta') || name.includes('cereal') || name.includes('grain')) {
    return 'grains';
  }
  
  return 'other';
};

export const estimateExpiryDate = (itemName: string, category: GroceryCategory): Date => {
  const today = new Date();
  const name = itemName.toLowerCase();
  
  // Basic expiry estimation based on category and item type
  let daysToAdd = 7; // default
  
  switch (category) {
    case 'dairy':
      if (name.includes('milk')) daysToAdd = 7;
      else if (name.includes('cheese')) daysToAdd = 14;
      else if (name.includes('yogurt')) daysToAdd = 10;
      break;
    case 'meat':
      daysToAdd = 3;
      break;
    case 'vegetables':
      if (name.includes('lettuce') || name.includes('spinach')) daysToAdd = 5;
      else if (name.includes('carrot') || name.includes('potato')) daysToAdd = 14;
      else daysToAdd = 7;
      break;
    case 'fruits':
      if (name.includes('banana')) daysToAdd = 5;
      else if (name.includes('apple')) daysToAdd = 14;
      else daysToAdd = 7;
      break;
    case 'grains':
      daysToAdd = 30;
      break;
    default:
      daysToAdd = 7;
  }
  
  return addDays(today, daysToAdd);
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
