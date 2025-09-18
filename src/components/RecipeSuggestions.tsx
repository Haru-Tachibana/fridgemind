import React, { useState, useEffect, useCallback } from 'react';
import { GroceryItem, Recipe } from '../types';
import { ChefHat, Search, Clock, Users } from 'lucide-react';
import { searchRecipes, RecipeSearchParams } from '../services/recipeApi';
import RecipeModal from './RecipeModal';

interface RecipeSuggestionsProps {
  items: GroceryItem[];
}

const RecipeSuggestions: React.FC<RecipeSuggestionsProps> = ({ items }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const ingredients = items.map(item => item.name);
      const searchParams: RecipeSearchParams = {
        ingredients,
        number: 20,
        ...(selectedFilter !== 'all' && { type: selectedFilter })
      };
      
      const fetchedRecipes = await searchRecipes(searchParams);
      setRecipes(fetchedRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  }, [items, selectedFilter]);

  // Fetch recipes when items change
  useEffect(() => {
    if (items.length > 0) {
      fetchRecipes();
    } else {
      setRecipes([]);
    }
  }, [fetchRecipes]);

  // Mock recipe data - fallback when API is not available (currently unused)
  // const mockRecipes: Recipe[] = [
  //   {
  //     id: '1',
  //     name: 'Chicken Stir Fry',
  //     description: 'Quick and healthy chicken stir fry with vegetables',
  //     ingredients: ['chicken', 'broccoli', 'carrot', 'soy sauce', 'garlic'],
  //     instructions: [
  //       'Cut chicken into bite-sized pieces',
  //       'Heat oil in a large pan',
  //       'Cook chicken until golden brown',
  //       'Add vegetables and stir fry for 5 minutes',
  //       'Add soy sauce and garlic, cook for 2 more minutes'
  //     ],
  //     prepTime: 15,
  //     cookTime: 10,
  //     servings: 4,
  //     tags: ['quick', 'healthy', 'dinner'],
  //     missingIngredients: ['soy sauce', 'garlic']
  //   },
  //   // ... more mock recipes
  // ];

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

  const filteredRecipes = recipes
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
              onClick={() => {
                setSelectedFilter(filter.id);
                // Refetch recipes with new filter
                if (items.length > 0) {
                  fetchRecipes();
                }
              }}
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

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center animate-pulse">
            <ChefHat className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Finding recipes...</h3>
          <p className="text-gray-500">Searching for recipes based on your ingredients</p>
        </div>
      )}

      {/* Recipes List */}
      {!loading && (
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
                <button 
                  onClick={() => setSelectedRecipe(recipe)}
                  className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                >
                  View Recipe
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredRecipes.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
};

export default RecipeSuggestions;
