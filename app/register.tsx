// Kyi sin thein
// app/(auth)/register.tsx

import { ThemedText } from '@/components/ThemedText';
import { supabase } from '@/lib/supabase';
import emailjs from '@emailjs/browser'; // Changed from @emailjs/react-native
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

// Initialize EmailJS with your public key
emailjs.init('Vf0-vPr5-9Mh2F3GG'); // Updated with new key

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const router = useRouter();

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation function
  const isValidPassword = (password: string) => {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /\d/.test(password);
  };

  // Generate 6-digit OTP
  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Send OTP via EmailJS
  const sendOtp = async () => {
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

    if (!isValidPassword(password)) {
      Alert.alert(
        'Error', 
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
  
    try {
      // Send OTP email using EmailJS
      const templateParams = {
        to_email: email,
        passcode: newOtp,        // ← Changed from 'otp_code' to 'passcode'
        to_name: email.split('@')[0], // ← Added to match {{to_name}}
        time: '15 minutes',      // ← Added to match {{time}}
        user_email: email
      };
  
      await emailjs.send(
        'service_846hi7r', // Your Service ID
        'template_86y4qys', // Your Template ID
        templateParams,
        'Vf0-vPr5-9Mh2F3GG' // Public key as 4th parameter
      );
  
      setOtpSent(true);
      Alert.alert(
        'OTP Sent', 
        'We\'ve sent a verification code to your email. Please check your inbox.'
      );
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the verification code.');
      return;
    }

    if (otp.trim() === generatedOtp) {
      setOtpVerified(true);
      Alert.alert('Success', 'Email verified successfully!');
    } else {
      Alert.alert('Error', 'Invalid verification code. Please try again.');
    }
  };

  // Handle email sign up after OTP verification
  const handleEmailSignUp = async () => {
    if (!otpVerified) {
      Alert.alert('Error', 'Please verify your email first.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          emailRedirectTo: 'fortunapp://complete_profile',
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        
        if (error.message.includes('User already registered')) {
          Alert.alert(
            'Account Exists', 
            'An account with this email already exists. Please sign in instead.',
            [
              { text: 'OK' },
              { text: 'Go to Sign In', onPress: () => router.push('/signin') }
            ]
          );
        } else {
          Alert.alert('Sign Up Error', error.message);
        }
        return;
      }

      if (data.user) {
        Alert.alert(
          'Success!', 
          'Account created successfully!',
          [{ text: 'OK', onPress: () => router.replace('/complete_profile') }]
        );
      }
    } catch (e: any) {
      console.error('Critical error in handleEmailSignUp:', e);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset form to send new OTP
  const resendOtp = () => {
    setOtpSent(false);
    setOtpVerified(false);
    setOtp('');
    setGeneratedOtp('');
  };

  // Add OAuth result handler (copied from signin.tsx)
  const handleOAuthResult = async (result: any) => {
    if (result.type === 'success') {
      console.log('OAuth flow completed, redirect URL:', result.url);
      
      const url = new URL(result.url);
      const fragment = url.hash.substring(1);
      const params = new URLSearchParams(fragment);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      
      if (accessToken && refreshToken) {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });
        
        if (data.session && !error) {
          console.log('Session established successfully');
          router.replace('/complete_profile');
        } else {
          console.error('Failed to establish session:', error);
          alert('Failed to establish session. Please try again.');
        }
      } else {
        console.error('Missing tokens in OAuth response');
        alert('Authentication failed. Missing tokens.');
      }
    } else if (result.type === 'cancel' || result.type === 'dismiss') {
      console.log('OAuth flow was cancelled or dismissed.');
    } else {
      console.log('OAuth flow returned an unexpected result type:', result.type);
    }
  };

  // Updated Google sign up method
  const handleGoogleSignUp = async () => {
    console.log('Attempting Google Sign-Up...');
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'fortunapp://complete_profile',
          skipBrowserRedirect: true,
          queryParams: {
            prompt: 'select_account'
          }
        },
      });

      console.log('signInWithOAuth response:', { data, error });

      if (error) {
        console.error('Google Sign-Up Error:', error);
        alert(`Google Sign-Up Error: ${error.message}`);
        return;
      }

      if (!data || !data.url) {
        console.error('Google Sign-Up did not return a URL.');
        alert('Google Sign-Up did not return a URL. Please try again.');
        return;
      }

      console.log('Manually redirecting to:', data.url);
      const result = await WebBrowser.openAuthSessionAsync(data.url, 'fortunapp://complete_profile');
      console.log('WebBrowser.openAuthSessionAsync result:', result);

      await handleOAuthResult(result);

    } catch (e: any) {
      console.error('Critical error in handleGoogleSignUp:', e);
      alert(`Critical error: ${e.message}`);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient
        colors={['#36010F', '#7b1e05', '#36010F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <ThemedText type="title" style={styles.headerText}>
            Create Account
          </ThemedText>
          <ThemedText style={styles.subtitleText}>
            Sign up to get started
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
            editable={!otpSent}
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
            editable={!otpSent}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!otpSent}
          />

          {/* OTP Input - Show only after OTP is sent */}
          {otpSent && (
            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit verification code"
              placeholderTextColor="#999"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              maxLength={6}
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}
          
          {/* Show different buttons based on state */}
          {!otpSent ? (
            <TouchableOpacity
              style={[styles.button, styles.emailButton, loading && styles.buttonDisabled]}
              activeOpacity={0.8}
              onPress={sendOtp}
              disabled={loading}
            >
              <ThemedText style={[styles.buttonText, styles.emailText]}>
                {loading ? 'Sending Code...' : 'Send Verification Code'}
              </ThemedText>
            </TouchableOpacity>
          ) : !otpVerified ? (
            <View>
              <TouchableOpacity
                style={[styles.button, styles.emailButton]}
                activeOpacity={0.8}
                onPress={verifyOtp}
              >
                <ThemedText style={[styles.buttonText, styles.emailText]}>
                  Verify Code
                </ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.resendButton]}
                activeOpacity={0.8}
                onPress={resendOtp}
              >
                <ThemedText style={[styles.buttonText, styles.resendText]}>
                  Resend Code
                </ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.emailButton, loading && styles.buttonDisabled]}
              activeOpacity={0.8}
              onPress={handleEmailSignUp}
              disabled={loading}
            >
              <ThemedText style={[styles.buttonText, styles.emailText]}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <ThemedText style={styles.dividerText}>OR</ThemedText>
          <View style={styles.dividerLine} />
        </View>

        {/* Google Sign Up Button */}
        <View style={styles.content}>
          <TouchableOpacity
            style={[styles.button, styles.googleButton]}
            activeOpacity={0.8}
            onPress={handleGoogleSignUp}
          >
            <FontAwesome
              name="google"
              size={24}
              color="#DB4437"
              style={styles.icon}
            />
            <ThemedText style={[styles.buttonText, styles.googleText]}>
              Sign Up with Google
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Footer link */}
        <TouchableOpacity
          onPress={() => router.push('/signin')}
          style={styles.footer}
        >
          <ThemedText style={styles.footerText}>
            Already have an account?{' '}
            <ThemedText style={styles.registerLink}>Sign In</ThemedText>
          </ThemedText>
        </TouchableOpacity>
      </LinearGradient>
    </>
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
  resendButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFFFFF',
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
  resendText: {
    color: '#FFFFFF',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  registerLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#fa8911',
  },
});