import { supabase } from './supabase'; 
import { UserProfile } from './auth'; 

class UserService { 
  // User Profile Operations 
  async createOrUpdateProfile(userId: string, profileData: Partial<UserProfile>) { 
    try { 
      const { data, error } = await supabase 
        .from('userdata') 
        .upsert({ 
          user_id: userId, 
          ...profileData, 
          updated_at: new Date().toISOString() 
        }) 
        .select() 
        .single(); 

      if (error) { 
        throw error; 
      } 

      return { 
        success: true, 
        profile: data 
      }; 
    } catch (error: any) { 
      return { 
        success: false, 
        error: error.message 
      }; 
    } 
  } 

  async getProfile(userId: string) { 
    try { 
      const { data, error } = await supabase 
        .from('userdata') 
        .select('*') 
        .eq('user_id', userId) 
        .single(); 

      if (error) { 
        throw error; 
      } 

      return { 
        success: true, 
        profile: data 
      }; 
    } catch (error: any) { 
      return { 
        success: false, 
        error: error.message 
      }; 
    } 
  } 

  async updateProfile(userId: string, updates: Partial<UserProfile>) { 
    try { 
      const { data, error } = await supabase 
        .from('userdata') 
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString() 
        }) 
        .eq('user_id', userId) 
        .select() 
        .single(); 

      if (error) { 
        throw error; 
      } 

      return { 
        success: true, 
        profile: data 
      }; 
    } catch (error: any) { 
      return { 
        success: false, 
        error: error.message 
      }; 
    } 
  } 

  async deleteProfile(userId: string) { 
    try { 
      const { error } = await supabase 
        .from('userdata') 
        .delete() 
        .eq('user_id', userId); 

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

  // Subscription Management 
  async updateSubscriptionStatus(userId: string, status: 'active' | 'inactive' | 'expired') { 
    try { 
      const { data, error } = await supabase 
        .from('userdata') 
        .update({ 
          subscription_status: status, 
          updated_at: new Date().toISOString() 
        }) 
        .eq('user_id', userId) 
        .select() 
        .single(); 

      if (error) { 
        throw error; 
      } 

      return { 
        success: true, 
        profile: data 
      }; 
    } catch (error: any) { 
      return { 
        success: false, 
        error: error.message 
      }; 
    } 
  } 

  async checkSubscriptionStatus(userId: string) { 
    try { 
      const { data, error } = await supabase 
        .from('userdata') 
        .select('subscription_status') 
        .eq('user_id', userId) 
        .single(); 

      if (error) { 
        throw error; 
      } 

      return { 
        success: true, 
        hasActiveSubscription: data.subscription_status === 'active' 
      }; 
    } catch (error: any) { 
      return { 
        success: false, 
        error: error.message, 
        hasActiveSubscription: false 
      }; 
    } 
  } 
} 

export const userService = new UserService();