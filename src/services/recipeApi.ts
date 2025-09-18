import { Recipe } from '../types';

// Spoonacular API - Free tier allows 150 requests per day
const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY || '035af799878c4e4cbc9532625f7a9b38';
const BASE_URL = 'https://api.spoonacular.com/recipes';

export interface RecipeSearchParams {
  ingredients: string[];
  diet?: string;
  type?: string;
  maxReadyTime?: number;
  number?: number;
}

export const searchRecipes = async (params: RecipeSearchParams): Promise<Recipe[]> => {
  try {
    // Use mock data if no API key is provided
    if (!API_KEY || API_KEY === 'your-spoonacular-api-key') {
      return getMockRecipes(params.ingredients);
    }

    const ingredients = params.ingredients.join(',');
    const queryParams = new URLSearchParams({
      apiKey: API_KEY,
      ingredients: ingredients,
      number: (params.number || 10).toString(),
      ...(params.diet && { diet: params.diet }),
      ...(params.type && { type: params.type }),
      ...(params.maxReadyTime && { maxReadyTime: params.maxReadyTime.toString() }),
    });

    const response = await fetch(`${BASE_URL}/findByIngredients?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }

    const data = await response.json();
    return Promise.all(data.map(transformRecipe));
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return getMockRecipes(params.ingredients);
  }
};

const transformRecipe = async (apiRecipe: any): Promise<Recipe> => {
  // Try to get detailed instructions
  let instructions: string[] = [];
  try {
    instructions = await getRecipeInstructions(apiRecipe.id.toString());
  } catch (error) {
    console.log('Could not fetch detailed instructions, using basic ones');
    instructions = [
      'Prepare all ingredients as needed',
      'Follow the cooking method for this recipe',
      'Season to taste and serve hot'
    ];
  }

  return {
    id: apiRecipe.id.toString(),
    name: apiRecipe.title,
    description: `A delicious recipe using ${apiRecipe.usedIngredientCount} of your ingredients`,
    ingredients: [
      ...apiRecipe.usedIngredients.map((ing: any) => ing.name),
      ...apiRecipe.missedIngredients.map((ing: any) => ing.name)
    ],
    instructions: instructions,
    prepTime: 15, // Default values since not provided in basic search
    cookTime: 30,
    servings: 4,
    tags: ['recipe'],
    missingIngredients: apiRecipe.missedIngredients.map((ing: any) => ing.name)
  };
};

// Mock recipes for demo purposes
const getMockRecipes = (ingredients: string[]): Recipe[] => {
  const mockRecipes: Recipe[] = [
    {
      id: '1',
      name: 'Chicken Stir Fry',
      description: 'Quick and healthy chicken stir fry with vegetables',
      ingredients: ['chicken', 'broccoli', 'carrot', 'soy sauce', 'garlic'],
      instructions: [
        'Cut chicken into bite-sized pieces and season with salt and pepper',
        'Heat 2 tablespoons of oil in a large wok or pan over high heat',
        'Add chicken and cook for 4-5 minutes until golden brown and cooked through',
        'Add broccoli and carrots, stir fry for 3-4 minutes until vegetables are tender-crisp',
        'Add minced garlic and cook for 30 seconds until fragrant',
        'Pour in soy sauce and toss everything together for 1-2 minutes',
        'Serve immediately over rice or noodles'
      ],
      prepTime: 15,
      cookTime: 10,
      servings: 4,
      tags: ['quick', 'healthy', 'dinner'],
      missingIngredients: ['soy sauce', 'garlic']
    },
    {
      id: '2',
      name: 'Vegetable Soup',
      description: 'Warm and comforting vegetable soup',
      ingredients: ['carrot', 'broccoli', 'onion', 'vegetable broth', 'salt', 'pepper'],
      instructions: [
        'Wash and chop all vegetables into bite-sized pieces',
        'Heat 1 tablespoon of olive oil in a large pot over medium heat',
        'Add diced onions and cook for 3-4 minutes until translucent',
        'Add carrots and cook for 2-3 minutes, then add broccoli',
        'Pour in vegetable broth and bring to a boil',
        'Reduce heat and simmer for 15-20 minutes until vegetables are tender',
        'Season with salt, pepper, and herbs to taste',
        'Serve hot with crusty bread'
      ],
      prepTime: 10,
      cookTime: 25,
      servings: 6,
      tags: ['healthy', 'soup', 'vegetarian'],
      missingIngredients: ['onion', 'vegetable broth']
    },
    {
      id: '3',
      name: 'Fruit Smoothie',
      description: 'Refreshing fruit smoothie for breakfast',
      ingredients: ['milk', 'apple', 'banana', 'yogurt', 'honey'],
      instructions: [
        'Peel and chop fruits',
        'Add all ingredients to blender',
        'Blend until smooth',
        'Add ice if desired'
      ],
      prepTime: 5,
      cookTime: 0,
      servings: 2,
      tags: ['breakfast', 'healthy', 'quick'],
      missingIngredients: ['yogurt', 'honey']
    },
    {
      id: '4',
      name: 'Pasta with Tomato Sauce',
      description: 'Classic pasta dish with homemade tomato sauce',
      ingredients: ['pasta', 'tomato', 'onion', 'garlic', 'olive oil', 'basil'],
      instructions: [
        'Cook pasta according to package directions',
        'Sauté onions and garlic in olive oil',
        'Add tomatoes and simmer for 15 minutes',
        'Toss pasta with sauce and fresh basil'
      ],
      prepTime: 10,
      cookTime: 20,
      servings: 4,
      tags: ['italian', 'vegetarian', 'dinner'],
      missingIngredients: ['onion', 'garlic', 'olive oil', 'basil']
    },
    {
      id: '5',
      name: 'Grilled Cheese Sandwich',
      description: 'Classic comfort food with melted cheese',
      ingredients: ['bread', 'cheese', 'butter'],
      instructions: [
        'Butter one side of each bread slice',
        'Place cheese between bread slices',
        'Cook in a pan until golden brown',
        'Flip and cook the other side'
      ],
      prepTime: 5,
      cookTime: 10,
      servings: 2,
      tags: ['quick', 'comfort', 'lunch'],
      missingIngredients: ['butter']
    }
  ];

  // Filter recipes based on available ingredients
  return mockRecipes.filter(recipe => {
    const availableIngredients = ingredients.map(ing => ing.toLowerCase());
    const recipeIngredients = recipe.ingredients.map(ing => ing.toLowerCase());
    
    // Check if at least one ingredient matches
    return recipeIngredients.some(ingredient => 
      availableIngredients.some(available => 
        available.includes(ingredient) || ingredient.includes(available)
      )
    );
  });
};

export const getRecipeInstructions = async (recipeId: string): Promise<string[]> => {
  try {
    if (!API_KEY || API_KEY === 'your-spoonacular-api-key') {
      return ['Detailed instructions would be available with a real API key'];
    }

    const response = await fetch(`${BASE_URL}/${recipeId}/analyzedInstructions?apiKey=${API_KEY}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch recipe instructions');
    }

    const data = await response.json();
    return data[0]?.steps?.map((step: any) => step.step) || [];
  } catch (error) {
    console.error('Error fetching recipe instructions:', error);
    return ['Instructions not available'];
  }
};
