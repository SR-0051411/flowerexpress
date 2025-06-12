
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ce940b1d307543efb4c39bce0537c076',
  appName: 'bloom-swift-delivery',
  webDir: 'dist',
  server: {
    url: 'https://ce940b1d-3075-43ef-b4c3-9bce0537c076.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ec4899',
      showSpinner: false
    }
  }
};

export default config;
