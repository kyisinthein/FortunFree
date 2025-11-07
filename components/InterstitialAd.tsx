import { AdMobInterstitial } from 'expo-ads-admob';
import { Platform } from 'react-native';

// Using expo-ads-admob instead
class InterstitialAdManager {
  private testAdUnitId = Platform.select({
    ios: 'ca-app-pub-3940256099942544/4411468910',
    android: 'ca-app-pub-3940256099942544/1033173712',
  });

  public async loadAd(): Promise<void> {
    if (Platform.OS === 'web') return;
    
    try {
      await AdMobInterstitial.setAdUnitID(this.testAdUnitId!);
      await AdMobInterstitial.requestAdAsync();
    } catch (error) {
      console.log('Error loading interstitial ad:', error);
    }
  }

  public async showAd(): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    
    try {
      await AdMobInterstitial.showAdAsync();
      return true;
    } catch (error) {
      console.log('Error showing interstitial ad:', error);
      return false;
    }
  }
}

export const interstitialAdManager = new InterstitialAdManager();

export const useInterstitialAd = () => {
  const showInterstitialAd = async (): Promise<boolean> => {
    return await interstitialAdManager.showAd();
  };

  const loadInterstitialAd = async () => {
    await interstitialAdManager.loadAd();
  };

  return {
    showInterstitialAd,
    loadInterstitialAd,
  };
};