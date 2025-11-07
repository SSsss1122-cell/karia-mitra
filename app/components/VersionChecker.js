// components/VersionChecker.js - UPDATED
'use client';
import { useEffect } from 'react';

export default function VersionChecker() {
  useEffect(() => {
    // Check if running in Capacitor app (Android/iOS)
    const isCapacitorApp = () => {
      return window.Capacitor || 
             window.androidBridge || 
             /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) && 
             !/Chrome|Firefox|Safari/i.test(navigator.userAgent);
    };

    const checkVersion = () => {
      try {
        // Sirf app mein hi version check karo, browser mein nahi
        if (!isCapacitorApp()) {
          console.log('Running in browser, skipping version check');
          return;
        }

        // Current version layout se aayegi
        const currentVersion = window.APP_VERSION || '1.0.0';
        const savedVersion = localStorage.getItem('app_version');
        
        console.log('Running in app, checking version...');
        console.log('Current Version:', currentVersion);
        console.log('Saved Version:', savedVersion);
        
        if (savedVersion !== currentVersion) {
          console.log('New version detected! Clearing cache...');
          
          // Cache clear karo
          localStorage.clear();
          sessionStorage.clear();
          
          // Naya version save karo
          localStorage.setItem('app_version', currentVersion);
          
          // Page refresh karo
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          console.log('App is up to date!');
        }
      } catch (error) {
        console.log('Version check error:', error);
      }
    };

    // Check karo jab component load ho
    checkVersion();
    
    return () => {};
  }, []);

  return null;
}