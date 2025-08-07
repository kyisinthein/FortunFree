// app/auth/callback.tsx
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Add a delay to ensure the OAuth flow completes
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Get the current session
        const { data, error } = await supabase.auth.getSession();
        
        console.log('Auth callback - session data:', data);
        console.log('Auth callback - error:', error);

        if (data?.session) {
          console.log('Session found, redirecting to profile');
          router.replace('/profile');
        } else {
          // Try to refresh the session
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshData?.session) {
            console.log('Session refreshed, redirecting to profile');
            router.replace('/profile');
          } else {
            console.log('No session found, redirecting to signin');
            router.replace('/signin');
          }
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        router.replace('/signin');
      }
    };

    handleAuth();
  }, []);

  return null;
}