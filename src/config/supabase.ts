import { createClient } from '@supabase/supabase-js';

// These will be set as environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder-key';

// Check if we have valid Supabase credentials
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && supabaseKey !== 'placeholder-key';
};

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          created_at?: string;
        };
      };
      grocery_items: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: string;
          expiry_date: string;
          added_date: string;
          quantity: number;
          unit: string;
        };
        Insert: {
          id: string;
          user_id: string;
          name: string;
          category: string;
          expiry_date: string;
          added_date: string;
          quantity: number;
          unit: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          category?: string;
          expiry_date?: string;
          added_date?: string;
          quantity?: number;
          unit?: string;
        };
      };
      shopping_list: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: string;
          is_must_have: boolean;
          auto_add: boolean;
          last_purchased: string | null;
        };
        Insert: {
          id: string;
          user_id: string;
          name: string;
          category: string;
          is_must_have: boolean;
          auto_add: boolean;
          last_purchased?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          category?: string;
          is_must_have?: boolean;
          auto_add?: boolean;
          last_purchased?: string | null;
        };
      };
    };
  };
}
