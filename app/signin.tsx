// app/signin.tsx

import { ThemedText } from '@/components/ThemedText';
import { supabase } from '@/lib/supabase';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

// Initialize WebBrowser
WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const navigation = useNavigation();

  // Listen for authentication state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // User has signed in, navigate to profile
          try {
            const { data: profile, error } = await supabase
              .from('userdata')
              .select('name, birth, purpose, gender')
              .eq('user_id', session.user.id)
              .single();

            if (!error && profile) {
              navigation.navigate('Profile', {
                firstName: profile.name,
                birthDate: profile.birth,
                purpose: profile.purpose,
                gender: profile.gender,
              });
            }
          } catch (error) {
            console.error('Error fetching profile:', error);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigation]);

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    try {
      // Sign in with Google
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: Platform.OS === 'web' ? 'http://localhost:8081/profile' : 'fortunai://profile',
          skipBrowserRedirect: Platform.OS !== 'web',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      // For mobile platforms, handle the OAuth flow manually
      if (Platform.OS !== 'web' && data?.url) {
        try {
          const result = await WebBrowser.openAuthSessionAsync(
            data.url,
            'fortunai://profile',
            {
              showInRecents: true,
              preferEphemeralSession: false,
            }
          );

          if (result.type === 'success') {
            // Get the user after successful authentication
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
              alert('Failed to get user data');
              return;
            }

            // Create or update user profile
            const { error: upsertError } = await supabase
              .from('userdata')
              .upsert({
                user_id: user.id,
                name: user.user_metadata?.full_name || 'User',
                birth: null,
                purpose: 'Not set',
                gender: 'Not set',
                email: user.email
              }, {
                onConflict: 'user_id'
              });

            if (upsertError) {
              alert('Error saving profile');
              return;
            }

            // Fetch the profile
            const { data: profile, error: profileError } = await supabase
              .from('userdata')
              .select('name, birth, purpose, gender')
              .eq('user_id', user.id)
              .single();

            if (profileError || !profile) {
              alert('Could not fetch profile data');
              return;
            }

            // Navigate to profile
            navigation.navigate('Profile', {
              firstName: profile.name,
              birthDate: profile.birth,
              purpose: profile.purpose,
              gender: profile.gender,
            });
          } else {
            alert('Sign in was cancelled or failed');
          }
        } catch (browserError) {
          alert('Error opening browser for sign in');
        }
      } else {
        // For web, the redirect will handle navigation
        console.log('Web authentication initiated');
      }
    } catch (error) {
      alert('An error occurred during sign in');
    }
  };

  return (
    <LinearGradient
      colors={['#36010F', '#7b1e05', '#36010F']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Header + underline */}
      <View style={styles.headerContainer}>
        <ThemedText type="title" style={styles.headerText}>
          Welcome Back!
        </ThemedText>
        <LinearGradient
          colors={['#FFD700', '#FF9900', '#FF5C39']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerLine}
        />
      </View>

      {/* Single Google Login Button */}
      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.button, styles.googleButton]}
          activeOpacity={0.8}
          onPress={handleGoogleSignIn}
        >
          <FontAwesome
            name="google"
            size={24}
            color="#DB4437"
            style={styles.icon}
          />
          <ThemedText style={[styles.buttonText, styles.googleText]}>
            Login with Google
          </ThemedText>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 50, // Increased spacing to match the image
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  headerLine: {
    height: 4,
    width: 120,
    borderRadius: 2,
    marginTop: 8,
  },
  content: {
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the content
    width: 280,
    paddingVertical: 16, // Slightly increased padding
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
  },
  icon: {
    marginRight: 12, // Adjusted spacing
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#36010F',
  },
  googleText: {
    color: '#36010F',
  },
});