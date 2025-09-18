import React, { useState } from 'react';
import { GroceryItem, Recipe } from '../types';
import { ChefHat, Search, Clock, Users } from 'lucide-react';

interface RecipeSuggestionsProps {
  items: GroceryItem[];
}

const RecipeSuggestions: React.FC<RecipeSuggestionsProps> = ({ items }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock recipe data - in a real app, this would come from an API
  const mockRecipes: Recipe[] = [
    {
      id: '1',
      name: 'Chicken Stir Fry',
      description: 'Quick and healthy chicken stir fry with vegetables',
      ingredients: ['chicken', 'broccoli', 'carrot', 'soy sauce', 'garlic'],
      instructions: [
        'Cut chicken into bite-sized pieces',
        'Heat oil in a large pan',
        'Cook chicken until golden brown',
        'Add vegetables and stir fry for 5 minutes',
        'Add soy sauce and garlic, cook for 2 more minutes'
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
        'Chop all vegetables',
        'Heat oil in a large pot',
        'Sauté onions until translucent',
        'Add vegetables and broth',
        'Simmer for 20 minutes',
        'Season with salt and pepper'
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
    }
  ];

  const filters = [
    { id: 'all', label: 'All Recipes' },
    { id: 'quick', label: 'Quick Meals' },
    { id: 'healthy', label: 'Healthy' },
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'dinner', label: 'Dinner' }
  ];

  const getAvailableIngredients = () => {
    return items.map(item => item.name.toLowerCase());
  };

  const checkRecipeAvailability = (recipe: Recipe) => {
    const availableIngredients = getAvailableIngredients();
    const missingIngredients = recipe.ingredients.filter(
      ingredient => !availableIngredients.some(available => 
        available.includes(ingredient.toLowerCase()) || 
        ingredient.toLowerCase().includes(available)
      )
    );
    return {
      ...recipe,
      missingIngredients,
      canMake: missingIngredients.length === 0
    };
  };

  const filteredRecipes = mockRecipes
    .map(checkRecipeAvailability)
    .filter(recipe => {
      const matchesFilter = selectedFilter === 'all' || recipe.tags.includes(selectedFilter);
      const matchesSearch = searchQuery === '' || 
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      // Sort by availability first, then by name
      if (a.canMake && !b.canMake) return -1;
      if (!a.canMake && b.canMake) return 1;
      return a.name.localeCompare(b.name);
    });

  if (items.length === 0) {
    return (
      <div className="w-full px-4 py-8">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <ChefHat className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No ingredients available</h3>
          <p className="text-gray-500">Add some groceries to get recipe suggestions!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6">
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedFilter === filter.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes List */}
      <div className="space-y-4">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className={`bg-white rounded-lg shadow-sm border p-4 ${
              recipe.canMake ? 'border-green-200' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">{recipe.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{recipe.description}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{recipe.prepTime + recipe.cookTime} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{recipe.servings} servings</span>
                  </div>
                  {recipe.canMake && <span className="text-green-600 font-medium">✓ Can make</span>}
                </div>
              </div>
              {recipe.canMake && (
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              )}
            </div>

            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Ingredients:</h4>
              <div className="flex flex-wrap gap-1">
                {recipe.ingredients.map((ingredient, index) => {
                  const isAvailable = getAvailableIngredients().some(available => 
                    available.includes(ingredient.toLowerCase()) || 
                    ingredient.toLowerCase().includes(available)
                  );
                  return (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded-full text-xs ${
                        isAvailable
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {ingredient}
                    </span>
                  );
                })}
              </div>
            </div>

            {recipe.missingIngredients.length > 0 && (
              <div className="mb-3 p-3 bg-yellow-50 rounded-lg">
                <h4 className="text-sm font-medium text-yellow-800 mb-1">Missing ingredients:</h4>
                <p className="text-sm text-yellow-700">
                  {recipe.missingIngredients.join(', ')}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex space-x-1">
                {recipe.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                View Recipe
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default RecipeSuggestions;
