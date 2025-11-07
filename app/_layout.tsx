// app/_layout.tsx

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
     <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
         <Stack.Screen name="index" />
         <Stack.Screen name="signin" />
         <Stack.Screen name="register" />
         <Stack.Screen name="setting" options={{ headerShown: false }} />
         <Stack.Screen name="dashboard" />
         <Stack.Screen name="(tabs)" />
         <Stack.Screen name="(protected)" />
         <Stack.Screen name="(auth)" />
         <Stack.Screen name="+not-found" />
         <Stack.Screen name="terms" />
         <Stack.Screen name="privacy" />
         <Stack.Screen name="complete_profile" />
         <Stack.Screen name="education" />
         <Stack.Screen name="profile" />
         
       </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}