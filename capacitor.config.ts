import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kariamitra.app',
  appName: 'Karia Mitra',
  webDir: 'out',

  // 👇 Add this block to fix Google login and deep linking
  server: {
    androidScheme: 'https',
    // optional: allow local testing via http during dev
    // url: 'http://192.168.x.x:3000', 
    cleartext: true
  },

  // 👇 Optional: improve behavior for mobile fullscreen layout
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
