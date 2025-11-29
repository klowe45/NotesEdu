import { Capacitor } from '@capacitor/core';

// IMPORTANT: Update this with your computer's local IP address
// To find your IP:
// - Mac: System Settings > Network > Wi-Fi > Details > IP address
// - Or run: ifconfig | grep "inet " | grep -v 127.0.0.1
const LOCAL_IP = '192.168.1.86'; // UPDATE THIS WITH YOUR ACTUAL IP

// Determine the API base URL based on the platform
const getApiUrl = () => {
  // Check if running on a native mobile platform
  if (Capacitor.isNativePlatform()) {
    // Running on iOS or Android - use local IP
    return `http://${LOCAL_IP}:4000/api`;
  } else {
    // Running in web browser - use localhost
    return 'http://localhost:4000/api';
  }
};

export const API_URL = getApiUrl();

// Export for debugging purposes
export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform();

// Log the current configuration (helps with debugging)
console.log('API Configuration:', {
  platform: platform,
  isNative: isNative,
  apiUrl: API_URL
});
