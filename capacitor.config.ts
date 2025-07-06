
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.flowerexpress.app',
  appName: 'FlowerExpress',
  webDir: 'dist',
  server: {
    url: 'https://ce940b1d-3075-43ef-b4c3-9bce0537c076.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#ec4899',
      showSpinner: true,
      spinnerColor: '#ffffff'
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#ec4899'
    },
    Keyboard: {
      resize: 'body',
      style: 'dark'
    },
    App: {
      launchUrl: 'https://ce940b1d-3075-43ef-b4c3-9bce0537c076.lovableproject.com?forceHideBadge=true'
    }
  },
  // Android specific configuration
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false
  },
  // iOS specific configuration
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true
  }
};

export default config;
