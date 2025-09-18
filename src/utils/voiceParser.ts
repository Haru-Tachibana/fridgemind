import { GroceryCategory } from '../types';
import { findFoodItems, FOOD_DATABASE } from '../data/foodDatabase';
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
    'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
    'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20,
    'a': 1, 'an': 1, 'some': 1, 'few': 2, 'several': 3, 'about': 1
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
    'dozen': 'dozen', 'dozens': 'dozen',
    'bunch': 'bunch', 'bunches': 'bunch',
    'slice': 'slice', 'slices': 'slice',
    'clove': 'clove', 'cloves': 'clove',
    'ear': 'ear', 'ears': 'ear',
    'fillet': 'fillet', 'fillets': 'fillet',
    'package': 'package', 'packages': 'package',
    'container': 'container', 'containers': 'container',
    'jar': 'jar', 'jars': 'jar',
    'stick': 'stick', 'sticks': 'stick',
    'loaf': 'loaf', 'loaves': 'loaf'
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

    // Try to find food items in the sentence
    const foundFoods = findFoodItems(sentence);
    
    if (foundFoods.length > 0) {
      // Use found food items
      for (const food of foundFoods) {
        items.push({
          name: food.name,
          quantity: quantity,
          unit: unit,
          category: food.category
        });
      }
    } else {
      // Fallback to original logic
      const nameWords = words.filter((word, index) => {
        if (index === quantityIndex || index === unitIndex) return false;
        if (['of', 'the', 'a', 'an', 'some', 'about'].includes(word)) return false;
        return true;
      });

      if (nameWords.length > 0) {
        const name = nameWords.join(' ').trim();
        
        // Try to find a partial match in the food database
        const partialMatch = FOOD_DATABASE.find(food => 
          food.name.includes(name) || 
          food.aliases.some(alias => alias.includes(name)) ||
          name.includes(food.name)
        );
        
        if (partialMatch) {
          items.push({
            name: partialMatch.name,
            quantity: quantity,
            unit: unit,
            category: partialMatch.category
          });
        } else {
          // Use original categorization as fallback
          const category = categorizeItem(name);
          items.push({
            name: name,
            quantity: quantity,
            unit: unit,
            category: category
          });
        }
      }
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
