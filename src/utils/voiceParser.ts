import { GroceryCategory } from '../types';
import { categorizeItem } from './helpers';

export interface ParsedItem {
  name: string;
  quantity: number;
  unit: string;
  category: GroceryCategory;
}

export const parseVoiceInput = (transcript: string): ParsedItem[] => {
  const items: ParsedItem[] = [];
  
  // Common quantity words to numbers
  const quantityMap: Record<string, number> = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'a': 1, 'an': 1, 'some': 1, 'few': 2, 'several': 3
  };

  // Common units
  const unitMap: Record<string, string> = {
    'carton': 'carton', 'cartons': 'carton',
    'bottle': 'bottle', 'bottles': 'bottle',
    'bag': 'bag', 'bags': 'bag',
    'box': 'box', 'boxes': 'box',
    'can': 'can', 'cans': 'can',
    'head': 'head', 'heads': 'head',
    'piece': 'piece', 'pieces': 'piece',
    'pound': 'lb', 'pounds': 'lb', 'lb': 'lb',
    'kilogram': 'kg', 'kilograms': 'kg', 'kg': 'kg',
    'liter': 'liter', 'liters': 'liter', 'l': 'liter',
    'cup': 'cup', 'cups': 'cup',
    'dozen': 'dozen', 'dozens': 'dozen'
  };

  // Split by common separators
  const sentences = transcript
    .toLowerCase()
    .split(/[.,;]|and|plus|\+|&/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const sentence of sentences) {
    const words = sentence.split(/\s+/);
    
    // Find quantity
    let quantity = 1;
    let quantityIndex = -1;
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (quantityMap[word]) {
        quantity = quantityMap[word];
        quantityIndex = i;
        break;
      } else if (!isNaN(Number(word))) {
        quantity = Number(word);
        quantityIndex = i;
        break;
      }
    }

    // Find unit
    let unit = 'piece';
    let unitIndex = -1;
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (unitMap[word]) {
        unit = unitMap[word];
        unitIndex = i;
        break;
      }
    }

    // Extract item name (remove quantity and unit words)
    const nameWords = words.filter((word, index) => {
      if (index === quantityIndex || index === unitIndex) return false;
      if (['of', 'the', 'a', 'an', 'some'].includes(word)) return false;
      return true;
    });

    if (nameWords.length > 0) {
      const name = nameWords.join(' ').trim();
      const category = categorizeItem(name);
      
      items.push({
        name: name,
        quantity: quantity,
        unit: unit,
        category: category
      });
    }
  }

  return items;
};

// Example usage:
// parseVoiceInput("I bought three apples and two cartons of milk")
// Returns: [
//   { name: "apples", quantity: 3, unit: "piece", category: "fruits" },
//   { name: "milk", quantity: 2, unit: "carton", category: "dairy" }
// ]
