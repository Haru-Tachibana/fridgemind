import { supabase, isSupabaseConfigured } from '../config/supabase';
import { GroceryItem, ShoppingListItem } from '../types';

// Fallback to localStorage when Supabase is not configured
const useLocalStorage = !isSupabaseConfigured();

// User management
export const createUser = async (email: string, name: string) => {
  if (useLocalStorage) {
    // Fallback to localStorage
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      created_at: new Date().toISOString(),
    };
    localStorage.setItem('fridgemind_user', JSON.stringify(user));
    return user;
  }

  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserByEmail = async (email: string) => {
  if (useLocalStorage) {
    // Fallback to localStorage
    const userData = localStorage.getItem('fridgemind_user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
  return data;
};

// Grocery items management
export const getGroceryItems = async (userId: string): Promise<GroceryItem[]> => {
  if (useLocalStorage) {
    // Fallback to localStorage
    const key = `fridgemind_grocery_items_${userId}`;
    const items = localStorage.getItem(key);
    if (!items) return [];
    return JSON.parse(items).map((item: any) => ({
      ...item,
      expiryDate: new Date(item.expiryDate),
      addedDate: new Date(item.addedDate),
    }));
  }

  const { data, error } = await supabase
    .from('grocery_items')
    .select('*')
    .eq('user_id', userId)
    .order('added_date', { ascending: false });

  if (error) throw error;
  
  return data.map(item => ({
    id: item.id,
    name: item.name,
    category: item.category as any,
    expiryDate: new Date(item.expiry_date),
    addedDate: new Date(item.added_date),
    quantity: item.quantity,
    unit: item.unit,
  }));
};

export const saveGroceryItems = async (userId: string, items: GroceryItem[]) => {
  if (useLocalStorage) {
    // Fallback to localStorage
    const key = `fridgemind_grocery_items_${userId}`;
    localStorage.setItem(key, JSON.stringify(items));
    return;
  }

  const itemsToSave = items.map(item => ({
    id: item.id,
    user_id: userId,
    name: item.name,
    category: item.category,
    expiry_date: item.expiryDate.toISOString(),
    added_date: item.addedDate.toISOString(),
    quantity: item.quantity,
    unit: item.unit,
  }));

  // Delete all existing items for this user
  await supabase
    .from('grocery_items')
    .delete()
    .eq('user_id', userId);

  // Insert new items
  if (itemsToSave.length > 0) {
    const { error } = await supabase
      .from('grocery_items')
      .insert(itemsToSave);

    if (error) throw error;
  }
};

export const addGroceryItem = async (userId: string, item: Omit<GroceryItem, 'id'>) => {
  // Check if there's an existing item with the same name and expiry date
  const { data: existingItems } = await supabase
    .from('grocery_items')
    .select('*')
    .eq('user_id', userId)
    .eq('name', item.name)
    .eq('expiry_date', item.expiryDate.toISOString());

  if (existingItems && existingItems.length > 0) {
    // Update existing item quantity
    const existingItem = existingItems[0];
    const { error } = await supabase
      .from('grocery_items')
      .update({ quantity: existingItem.quantity + item.quantity })
      .eq('id', existingItem.id);

    if (error) throw error;
    return existingItem.id;
  } else {
    // Add new item
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: userId,
      name: item.name,
      category: item.category,
      expiry_date: item.expiryDate.toISOString(),
      added_date: item.addedDate.toISOString(),
      quantity: item.quantity,
      unit: item.unit,
    };

    const { data, error } = await supabase
      .from('grocery_items')
      .insert([newItem])
      .select()
      .single();

    if (error) throw error;
    return data.id;
  }
};

export const removeGroceryItem = async (userId: string, itemId: string) => {
  const { error } = await supabase
    .from('grocery_items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', userId);

  if (error) throw error;
};

export const updateGroceryItemQuantity = async (userId: string, itemId: string, quantity: number) => {
  if (quantity <= 0) {
    await removeGroceryItem(userId, itemId);
    return;
  }

  const { error } = await supabase
    .from('grocery_items')
    .update({ quantity })
    .eq('id', itemId)
    .eq('user_id', userId);

  if (error) throw error;
};

// Shopping list management
export const getShoppingList = async (userId: string): Promise<ShoppingListItem[]> => {
  const { data, error } = await supabase
    .from('shopping_list')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data.map(item => ({
    id: item.id,
    name: item.name,
    category: item.category as any,
    isMustHave: item.is_must_have,
    autoAdd: item.auto_add,
    lastPurchased: item.last_purchased ? new Date(item.last_purchased) : undefined,
  }));
};

export const saveShoppingList = async (userId: string, items: ShoppingListItem[]) => {
  const itemsToSave = items.map(item => ({
    id: item.id,
    user_id: userId,
    name: item.name,
    category: item.category,
    is_must_have: item.isMustHave,
    auto_add: item.autoAdd,
    last_purchased: item.lastPurchased?.toISOString() || null,
  }));

  // Delete all existing items for this user
  await supabase
    .from('shopping_list')
    .delete()
    .eq('user_id', userId);

  // Insert new items
  if (itemsToSave.length > 0) {
    const { error } = await supabase
      .from('shopping_list')
      .insert(itemsToSave);

    if (error) throw error;
  }
};

export const addShoppingListItem = async (userId: string, item: Omit<ShoppingListItem, 'id'>) => {
  const newItem = {
    id: Math.random().toString(36).substr(2, 9),
    user_id: userId,
    name: item.name,
    category: item.category,
    is_must_have: item.isMustHave,
    auto_add: item.autoAdd,
    last_purchased: item.lastPurchased?.toISOString() || null,
  };

  const { data, error } = await supabase
    .from('shopping_list')
    .insert([newItem])
    .select()
    .single();

  if (error) throw error;
  return data.id;
};

export const removeShoppingListItem = async (userId: string, itemId: string) => {
  const { error } = await supabase
    .from('shopping_list')
    .delete()
    .eq('id', itemId)
    .eq('user_id', userId);

  if (error) throw error;
};
