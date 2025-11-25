import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

export const AdBanner: React.FC<{ size?: BannerAdSize }> = ({ 
  size = BannerAdSize.BANNER 
}) => {
  // Only show on mobile platforms (Android and iOS)
  if (Platform.OS === 'web') {
    return null;
  }

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={'ca-app-pub-6368412009992703/1126604783'} // <-- This is your Ad Unit ID
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => {
          console.log('✅ Banner ad loaded successfully!');
        }}
        onAdFailedToLoad={(error) => {
          console.log('❌ Banner ad failed to load:', error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    marginVertical: 8,
    borderRadius: 4,
  },
});