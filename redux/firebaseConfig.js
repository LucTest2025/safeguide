import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyA-rUqQHXShWCpl_dchf99vYSawvMizBsk",
  authDomain: "safeguide-5408e.firebaseapp.com",
  projectId: "safeguide-5408e",
  storageBucket: "safeguide-5408e.firebasestorage.app",
  messagingSenderId: "613410173558",
  appId: "1:613410173558:android:362fe0abb5c2d6974a6557",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
