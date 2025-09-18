// Authentication service using Supabase database
import { createUser, getUserByEmail } from './database';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

class AuthService {
  private static instance: AuthService;
  private listeners: ((state: AuthState) => void)[] = [];
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  };

  private constructor() {
    this.loadUserFromStorage();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private loadUserFromStorage() {
    try {
      const userData = localStorage.getItem('fridgemind_user');
      if (userData) {
        const user = JSON.parse(userData);
        this.state = {
          user: {
            ...user,
            createdAt: new Date(user.createdAt),
          },
          isAuthenticated: true,
          isLoading: false,
        };
      } else {
        this.state = { ...this.state, isLoading: false };
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      this.state = { ...this.state, isLoading: false };
    }
    this.notifyListeners();
  }

  private saveUserToStorage(user: User) {
    localStorage.setItem('fridgemind_user', JSON.stringify(user));
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getState(): AuthState {
    return { ...this.state };
  }

  async signUp(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if user already exists
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return { success: false, error: 'User already exists' };
      }

      // Create new user in database
      const userData = await createUser(email, name);
      const user: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        createdAt: new Date(userData.created_at),
      };

      this.saveUserToStorage(user);
      this.state = {
        user,
        isAuthenticated: true,
        isLoading: false,
      };

      this.notifyListeners();
      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Failed to create account' };
    }
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Find user in database
      const userData = await getUserByEmail(email);
      if (!userData) {
        return { success: false, error: 'No account found' };
      }

      const user: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        createdAt: new Date(userData.created_at),
      };

      this.saveUserToStorage(user);
      this.state = {
        user,
        isAuthenticated: true,
        isLoading: false,
      };

      this.notifyListeners();
      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Failed to sign in' };
    }
  }

  async signOut(): Promise<void> {
    localStorage.removeItem('fridgemind_user');
    this.state = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
    };
    this.notifyListeners();
  }

  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    // For now, just return success - in a real app, you'd integrate with email service
    return { success: true };
  }
}

export default AuthService;
