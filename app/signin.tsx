// app/signin.tsx

import { ThemedText } from '@/components/ThemedText';
import { supabase } from '@/lib/supabase';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

// Initialize WebBrowser
WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Listen for authentication state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // User has signed in, check if profile exists
          try {
            const { data: profile, error } = await supabase
              .from('userdata')
              .select('name, birth, purpose, gender')
              .eq('user_id', session.user.id)
              .single();

            if (!error && profile && profile.name && profile.birth) {
              // Profile exists and is complete, go to dashboard
              router.replace('/dashboard');
            } else {
              // Profile doesn't exist or is incomplete, go to complete profile
              router.replace('/complete_profile');
            }
          } catch (error) {
            console.error('Error fetching profile:', error);
            router.replace('/complete_profile');
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigation, router]);

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email sign in/up
  const handleEmailAuth = async () => {
    if (loading) return;

    // Validation
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter a password.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up logic
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password: password,
          options: {
            emailRedirectTo: 'fortunapp://complete_profile',
          },
        });

        if (error) {
          console.error('Sign up error:', error);
          Alert.alert('Sign Up Error', error.message);
          return;
        }

        if (data.user) {
          if (data.user.email_confirmed_at) {
            Alert.alert(
              'Success!', 
              'Account created successfully!',
              [{ text: 'OK', onPress: () => router.replace('/complete_profile') }]
            );
          } else {
            Alert.alert(
              'Check Your Email', 
              'We\'ve sent you a confirmation email. Please check your inbox and click the confirmation link to activate your account.'
            );
          }
        }
      } else {
        // Sign in logic
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: password,
        });

        if (error) {
          console.error('Sign in error:', error);
          
          if (error.message.includes('Invalid login credentials')) {
            Alert.alert('Error', 'Invalid email or password. Please try again.');
          } else if (error.message.includes('Email not confirmed')) {
            Alert.alert('Error', 'Please check your email and confirm your account before signing in.');
          } else {
            Alert.alert('Sign In Error', error.message);
          }
          return;
        }

        if (data.session) {
          console.log('Sign in successful');
          // Navigation will be handled by the auth state change listener
        }
      }
    } catch (e: any) {
      console.error('Critical error in handleEmailAuth:', e);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    try {
      // Sign in with Google
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: Platform.OS === 'web' ? 'http://localhost:8081/complete_profile' : 'fortunapp://complete_profile',
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
            'fortunapp://complete_profile',
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

            // Check if profile is complete
            const { data: profile, error: profileError } = await supabase
              .from('userdata')
              .select('name, birth, purpose, gender')
              .eq('user_id', user.id)
              .single();

            if (profileError || !profile) {
              router.replace('/complete_profile');
            } else if (profile.name && profile.birth) {
              router.replace('/dashboard');
            } else {
              router.replace('/complete_profile');
            }
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
          {isSignUp ? 'Create Account' : 'Welcome Back!'}
        </ThemedText>
        <LinearGradient
          colors={['#FFD700', '#FF9900', '#FF5C39']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerLine}
        />
      </View>

      {/* Email Form */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        <TouchableOpacity
          style={[styles.button, styles.emailButton, loading && styles.buttonDisabled]}
          activeOpacity={0.8}
          onPress={handleEmailAuth}
          disabled={loading}
        >
          <ThemedText style={[styles.buttonText, styles.emailText]}>
            {loading 
              ? (isSignUp ? 'Creating Account...' : 'Signing In...') 
              : (isSignUp ? 'Sign Up with Email' : 'Sign In with Email')
            }
          </ThemedText>
        </TouchableOpacity>
      </View>


      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <ThemedText style={styles.dividerText}>OR</ThemedText>
        <View style={styles.dividerLine} />
      </View>

      {/* Google Login Button */}
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
            {isSignUp ? 'Sign Up with Google' : 'Sign In with Google'}
          </ThemedText>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.toggleContainer}
        onPress={() => router.push('/register')}
      >
        <ThemedText style={styles.toggleText}>
          Don't have an account?{' '}
          <ThemedText style={styles.toggleLink}>
            Sign Up
          </ThemedText>
        </ThemedText>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
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
  formContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    width: 280,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#36010F',
    marginBottom: 16,
  },
  toggleContainer: {
    marginBottom: 20,
  },
  toggleText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  toggleLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#fa8911',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 280,
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#FFFFFF',
    opacity: 0.3,
  },
  dividerText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginHorizontal: 15,
    opacity: 0.7,
  },
  content: {
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
    paddingVertical: 14,
    borderRadius: 25,
    marginBottom: 16,
  },
  emailButton: {
    backgroundColor: '#fa8911',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  icon: {
    marginRight: 15,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emailText: {
    color: '#FFFFFF',
  },
  googleText: {
    color: '#36010F',
  },
});