import { supabase } from './supabase';
import { Alert } from 'react-native';

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: any;
}

export interface UserProfile {
  user_id: string;
  name: string;
  birth: string;
  gender: string;
  purpose?: string;
  subscription_status?: string;
  created_at?: string;
  updated_at?: string;
}

class AuthService {
  // Email Authentication
  async signUpWithEmail(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
        needsEmailConfirmation: !data.session
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async signInWithEmail(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        user: data.user,
        session: data.session
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // OAuth Authentication
  async signInWithGoogle(redirectTo: string) {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: true,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        url: data.url
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Session Management
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        throw error;
      }

      return {
        success: true,
        user
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getCurrentSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }

      return {
        success: true,
        session: data.session
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async setSession(accessToken: string, refreshToken: string) {
    try {
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        session: data.session,
        user: data.user
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async refreshSession() {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw error;
      }

      return {
        success: true,
        session: data.session,
        user: data.user
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      return {
        success: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Auth State Listener
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();