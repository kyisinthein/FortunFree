import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const AdBanner: React.FC<{ size?: any }> = ({ size }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.adText}>Ad Placeholder (Web)</Text>
      <Text style={styles.subText}>Ads not supported on web platform</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
    borderRadius: 4,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  adText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  subText: {
    fontSize: 12,
    color: '#999',
  },
});