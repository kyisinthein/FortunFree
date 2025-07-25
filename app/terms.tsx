import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TermsScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms and Conditions</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</Text>
          
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.text}>
            By downloading, installing, or using the FortunFree mobile application ("the App"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not use the App.
          </Text>

          <Text style={styles.sectionTitle}>2. Description of Service</Text>
          <Text style={styles.text}>
            FortunFree is a completely free application that provides astrological readings and fortune-telling services based on Chinese astrology (BaZi), Five Elements theory, and traditional divination methods. Our free services include:
          </Text>
          <Text style={styles.bulletPoint}>• Free astrological personality analysis</Text>
          <Text style={styles.bulletPoint}>• BaZi (Four Pillars) fortune readings</Text>
          <Text style={styles.bulletPoint}>• Educational content about Chinese astrology</Text>
          <Text style={styles.bulletPoint}>• Cultural insights and traditional wisdom</Text>
          <Text style={styles.bulletPoint}>• Personal development guidance</Text>

          <Text style={styles.sectionTitle}>3. Free Service</Text>
          <Text style={styles.text}>
            FortunFree is completely free to use. There are no subscription fees, in-app purchases, or hidden costs. All features and content are provided at no charge to users.
          </Text>

          <Text style={styles.sectionTitle}>4. Educational and Entertainment Purpose</Text>
          <Text style={styles.text}>
            FortunFree is designed for educational and entertainment purposes. The app provides insights into traditional Chinese astrology and cultural wisdom for personal reflection and learning.
          </Text>
          <Text style={styles.text}>
            The App should not be used as a substitute for professional advice in matters of health, finance, legal issues, or major life decisions. All readings are for entertainment and educational purposes only.
          </Text>

          <Text style={styles.sectionTitle}>5. User Accounts and Data</Text>
          <Text style={styles.text}>
            To use the App, you may need to create an account with basic information such as your birth date and gender for astrological calculations. You agree to:
          </Text>
          <Text style={styles.bulletPoint}>• Provide accurate birth information for readings</Text>
          <Text style={styles.bulletPoint}>• Keep your account information updated</Text>
          <Text style={styles.bulletPoint}>• Maintain the security of your account credentials</Text>
          <Text style={styles.bulletPoint}>• Accept responsibility for all activities under your account</Text>

          <Text style={styles.sectionTitle}>6. Privacy and Data Protection</Text>
          <Text style={styles.text}>
            Your privacy is important to us. We collect minimal personal information necessary for providing astrological readings. We do not sell or share your personal data with third parties. For detailed information, please refer to our Privacy Policy.
          </Text>

          <Text style={styles.sectionTitle}>7. Intellectual Property</Text>
          <Text style={styles.text}>
            All content, features, and functionality of the App are owned by FortunFree or its licensors and are protected by copyright and intellectual property laws. The astrological content is based on traditional Chinese astrology methods and cultural knowledge.
          </Text>

          <Text style={styles.sectionTitle}>8. Prohibited Uses</Text>
          <Text style={styles.text}>
            You agree not to use the App for any unlawful purpose. Prohibited activities include:
          </Text>
          <Text style={styles.bulletPoint}>• Violating any applicable laws or regulations</Text>
          <Text style={styles.bulletPoint}>• Attempting to gain unauthorized access to the App</Text>
          <Text style={styles.bulletPoint}>• Interfering with the App's operation or security</Text>
          <Text style={styles.bulletPoint}>• Using the App to harass, abuse, or harm others</Text>

          <Text style={styles.sectionTitle}>9. Disclaimers</Text>
          <Text style={styles.text}>
            IMPORTANT DISCLAIMERS:
          </Text>
          <Text style={styles.bulletPoint}>• Astrological readings are for entertainment and educational purposes only</Text>
          <Text style={styles.bulletPoint}>• Results are not guaranteed and should not be relied upon for important decisions</Text>
          <Text style={styles.bulletPoint}>• The App is provided "as is" without warranties of any kind</Text>
          <Text style={styles.bulletPoint}>• We do not guarantee the accuracy of astrological interpretations</Text>
          <Text style={styles.bulletPoint}>• Use of the App is at your own discretion</Text>

          <Text style={styles.sectionTitle}>10. Limitation of Liability</Text>
          <Text style={styles.text}>
            FortunFree and its developers shall not be liable for any damages arising from your use of the App or reliance on astrological readings provided.
          </Text>

          <Text style={styles.sectionTitle}>11. Changes to Terms</Text>
          <Text style={styles.text}>
            We may update these Terms occasionally. Continued use of the App after changes constitutes acceptance of the new Terms.
          </Text>

          <Text style={styles.sectionTitle}>12. Contact Information</Text>
          <Text style={styles.text}>
            If you have any questions about these Terms and Conditions, please contact us through the app's feedback feature or support channels (joinfortunai@gmail.com).
          </Text>

          <Text style={styles.acknowledgment}>
            By using FortunFree, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#2d1810',
    borderBottomWidth: 1,
    borderBottomColor: '#8B4513',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    paddingVertical: 20,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    marginBottom: 5,
    marginLeft: 10,
  },
  acknowledgment: {
    fontSize: 14,
    color: '#D4AF37',
    lineHeight: 20,
    marginTop: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default TermsScreen;