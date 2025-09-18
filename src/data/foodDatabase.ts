import { GroceryCategory } from '../types';

export interface FoodItem {
  name: string;
  category: GroceryCategory;
  aliases: string[];
  commonUnits: string[];
}

export const FOOD_DATABASE: FoodItem[] = [
  // Fruits
  { name: 'apple', category: 'fruits', aliases: ['apples'], commonUnits: ['piece', 'kg', 'lb'] },
  { name: 'banana', category: 'fruits', aliases: ['bananas'], commonUnits: ['piece', 'bunch', 'kg'] },
  { name: 'orange', category: 'fruits', aliases: ['oranges'], commonUnits: ['piece', 'kg', 'lb'] },
  { name: 'strawberry', category: 'fruits', aliases: ['strawberries'], commonUnits: ['box', 'kg', 'lb'] },
  { name: 'blueberry', category: 'fruits', aliases: ['blueberries'], commonUnits: ['box', 'kg', 'lb'] },
  { name: 'grape', category: 'fruits', aliases: ['grapes'], commonUnits: ['bunch', 'kg', 'lb'] },
  { name: 'lemon', category: 'fruits', aliases: ['lemons'], commonUnits: ['piece', 'kg', 'lb'] },
  { name: 'lime', category: 'fruits', aliases: ['limes'], commonUnits: ['piece', 'kg', 'lb'] },
  { name: 'peach', category: 'fruits', aliases: ['peaches'], commonUnits: ['piece', 'kg', 'lb'] },
  { name: 'pear', category: 'fruits', aliases: ['pears'], commonUnits: ['piece', 'kg', 'lb'] },
  { name: 'cherry', category: 'fruits', aliases: ['cherries'], commonUnits: ['box', 'kg', 'lb'] },
  { name: 'mango', category: 'fruits', aliases: ['mangos'], commonUnits: ['piece', 'kg', 'lb'] },
  { name: 'pineapple', category: 'fruits', aliases: ['pineapples'], commonUnits: ['piece', 'kg', 'lb'] },
  { name: 'watermelon', category: 'fruits', aliases: ['watermelons'], commonUnits: ['piece', 'kg', 'lb'] },
  { name: 'avocado', category: 'fruits', aliases: ['avocados'], commonUnits: ['piece', 'kg', 'lb'] },

  // Vegetables
  { name: 'tomato', category: 'vegetables', aliases: ['tomatoes'], commonUnits: ['piece', 'kg', 'lb', 'can'] },
  { name: 'carrot', category: 'vegetables', aliases: ['carrots'], commonUnits: ['piece', 'kg', 'lb', 'bunch'] },
  { name: 'broccoli', category: 'vegetables', aliases: ['broccolis'], commonUnits: ['head', 'kg', 'lb'] },
  { name: 'lettuce', category: 'vegetables', aliases: ['lettuces'], commonUnits: ['head', 'piece', 'kg'] },
  { name: 'spinach', category: 'vegetables', aliases: ['spinaches'], commonUnits: ['bunch', 'bag', 'kg'] },
  { name: 'onion', category: 'vegetables', aliases: ['onions'], commonUnits: ['piece', 'kg', 'lb'] },
  { name: 'garlic', category: 'vegetables', aliases: ['garlics'], commonUnits: ['clove', 'head', 'kg'] },
  { name: 'potato', category: 'vegetables', aliases: ['potatoes'], commonUnits: ['piece', 'kg', 'lb', 'bag'] },
  { name: 'cucumber', category: 'vegetables', aliases: ['cucumbers'], commonUnits: ['piece', 'kg', 'lb'] },
  { name: 'pepper', category: 'vegetables', aliases: ['peppers', 'bell pepper', 'bell peppers'], commonUnits: ['piece', 'kg', 'lb'] },
  { name: 'cabbage', category: 'vegetables', aliases: ['cabbages'], commonUnits: ['head', 'kg', 'lb'] },
  { name: 'cauliflower', category: 'vegetables', aliases: ['cauliflowers'], commonUnits: ['head', 'kg', 'lb'] },
  { name: 'celery', category: 'vegetables', aliases: ['celeries'], commonUnits: ['bunch', 'piece', 'kg'] },
  { name: 'mushroom', category: 'vegetables', aliases: ['mushrooms'], commonUnits: ['piece', 'box', 'kg'] },
  { name: 'corn', category: 'vegetables', aliases: ['corns', 'sweet corn'], commonUnits: ['ear', 'can', 'kg'] },
  { name: 'zucchini', category: 'vegetables', aliases: ['zucchinis', 'courgette'], commonUnits: ['piece', 'kg', 'lb'] },
  { name: 'eggplant', category: 'vegetables', aliases: ['eggplants', 'aubergine'], commonUnits: ['piece', 'kg', 'lb'] },
  { name: 'asparagus', category: 'vegetables', aliases: ['asparaguses'], commonUnits: ['bunch', 'kg', 'lb'] },

  // Meat
  { name: 'chicken', category: 'meat', aliases: ['chicken breast', 'chicken thighs', 'chicken wings'], commonUnits: ['piece', 'kg', 'lb'] },
  { name: 'beef', category: 'meat', aliases: ['ground beef', 'beef steak', 'beef roast'], commonUnits: ['kg', 'lb', 'piece'] },
  { name: 'pork', category: 'meat', aliases: ['pork chops', 'pork tenderloin', 'ground pork'], commonUnits: ['kg', 'lb', 'piece'] },
  { name: 'lamb', category: 'meat', aliases: ['lamb chops', 'lamb leg'], commonUnits: ['kg', 'lb', 'piece'] },
  { name: 'turkey', category: 'meat', aliases: ['turkey breast', 'ground turkey'], commonUnits: ['kg', 'lb', 'piece'] },
  { name: 'fish', category: 'meat', aliases: ['salmon', 'tuna', 'cod', 'halibut'], commonUnits: ['kg', 'lb', 'piece', 'fillet'] },
  { name: 'shrimp', category: 'meat', aliases: ['shrimps', 'prawns'], commonUnits: ['kg', 'lb', 'piece'] },
  { name: 'bacon', category: 'meat', aliases: ['bacons'], commonUnits: ['package', 'kg', 'lb', 'slice'] },
  { name: 'sausage', category: 'meat', aliases: ['sausages'], commonUnits: ['piece', 'kg', 'lb', 'package'] },
  { name: 'ham', category: 'meat', aliases: ['hams'], commonUnits: ['kg', 'lb', 'slice', 'piece'] },

  // Dairy
  { name: 'milk', category: 'dairy', aliases: ['whole milk', 'skim milk', '2% milk'], commonUnits: ['liter', 'gallon', 'carton', 'ml'] },
  { name: 'cheese', category: 'dairy', aliases: ['cheddar', 'mozzarella', 'swiss cheese'], commonUnits: ['kg', 'lb', 'slice', 'block'] },
  { name: 'yogurt', category: 'dairy', aliases: ['yogurts', 'greek yogurt'], commonUnits: ['cup', 'container', 'kg'] },
  { name: 'butter', category: 'dairy', aliases: ['butters'], commonUnits: ['stick', 'kg', 'lb', 'tbsp'] },
  { name: 'cream', category: 'dairy', aliases: ['heavy cream', 'whipping cream'], commonUnits: ['ml', 'cup', 'liter'] },
  { name: 'sour cream', category: 'dairy', aliases: ['sour creams'], commonUnits: ['cup', 'container', 'ml'] },
  { name: 'cottage cheese', category: 'dairy', aliases: ['cottage cheeses'], commonUnits: ['cup', 'container', 'kg'] },
  { name: 'cream cheese', category: 'dairy', aliases: ['cream cheeses'], commonUnits: ['package', 'kg', 'lb'] },
  { name: 'eggs', category: 'dairy', aliases: ['egg'], commonUnits: ['piece', 'dozen', 'carton'] },
  { name: 'ice cream', category: 'dairy', aliases: ['ice creams'], commonUnits: ['liter', 'gallon', 'pint'] },

  // Grains
  { name: 'bread', category: 'grains', aliases: ['white bread', 'whole wheat bread'], commonUnits: ['loaf', 'slice', 'piece'] },
  { name: 'rice', category: 'grains', aliases: ['white rice', 'brown rice', 'jasmine rice'], commonUnits: ['kg', 'lb', 'cup', 'bag'] },
  { name: 'pasta', category: 'grains', aliases: ['spaghetti', 'penne', 'macaroni'], commonUnits: ['kg', 'lb', 'box', 'package'] },
  { name: 'oats', category: 'grains', aliases: ['oatmeal', 'rolled oats'], commonUnits: ['kg', 'lb', 'cup', 'box'] },
  { name: 'quinoa', category: 'grains', aliases: ['quinoas'], commonUnits: ['kg', 'lb', 'cup', 'bag'] },
  { name: 'barley', category: 'grains', aliases: ['barleys'], commonUnits: ['kg', 'lb', 'cup', 'bag'] },
  { name: 'flour', category: 'grains', aliases: ['all purpose flour', 'whole wheat flour'], commonUnits: ['kg', 'lb', 'cup', 'bag'] },
  { name: 'cereal', category: 'grains', aliases: ['cereals'], commonUnits: ['box', 'kg', 'lb'] },
  { name: 'crackers', category: 'grains', aliases: ['cracker'], commonUnits: ['box', 'package', 'piece'] },
  { name: 'tortilla', category: 'grains', aliases: ['tortillas'], commonUnits: ['piece', 'package', 'dozen'] },

  // Other
  { name: 'oil', category: 'other', aliases: ['olive oil', 'vegetable oil', 'coconut oil'], commonUnits: ['ml', 'liter', 'bottle'] },
  { name: 'vinegar', category: 'other', aliases: ['balsamic vinegar', 'white vinegar'], commonUnits: ['ml', 'liter', 'bottle'] },
  { name: 'salt', category: 'other', aliases: ['sea salt', 'table salt'], commonUnits: ['kg', 'lb', 'tsp', 'tbsp'] },
  { name: 'pepper', category: 'other', aliases: ['black pepper', 'white pepper'], commonUnits: ['kg', 'lb', 'tsp', 'tbsp'] },
  { name: 'sugar', category: 'other', aliases: ['white sugar', 'brown sugar'], commonUnits: ['kg', 'lb', 'cup', 'tsp'] },
  { name: 'honey', category: 'other', aliases: ['honeys'], commonUnits: ['ml', 'liter', 'jar', 'tbsp'] },
  { name: 'nuts', category: 'other', aliases: ['almonds', 'walnuts', 'peanuts'], commonUnits: ['kg', 'lb', 'cup', 'bag'] },
  { name: 'beans', category: 'other', aliases: ['black beans', 'kidney beans', 'chickpeas'], commonUnits: ['can', 'kg', 'lb', 'cup'] },
  { name: 'soup', category: 'other', aliases: ['soups'], commonUnits: ['can', 'box', 'liter'] },
  { name: 'sauce', category: 'other', aliases: ['tomato sauce', 'soy sauce'], commonUnits: ['ml', 'liter', 'bottle', 'jar'] },
];

export const findFoodItem = (input: string): FoodItem | null => {
  const normalizedInput = input.toLowerCase().trim();
  
  for (const food of FOOD_DATABASE) {
    // Check exact match
    if (food.name === normalizedInput) {
      return food;
    }
    
    // Check aliases
    for (const alias of food.aliases) {
      if (alias.toLowerCase() === normalizedInput) {
        return food;
      }
      
      // Check if input contains the alias
      if (normalizedInput.includes(alias.toLowerCase())) {
        return food;
      }
    }
  }
  
  return null;
};

export const findFoodItems = (input: string): FoodItem[] => {
  const words = input.toLowerCase().split(/\s+/);
  const foundItems: FoodItem[] = [];
  
  for (const word of words) {
    const food = findFoodItem(word);
    if (food && !foundItems.some(item => item.name === food.name)) {
      foundItems.push(food);
    }
  }
  
  return foundItems;
};
