import React, { useEffect } from 'react';
import { Alert, PermissionsAndroid, ActivityIndicator, Linking } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';

const Stack = createStackNavigator();

function App() {
  useEffect(() => {
    const requestUserPermission = async () => {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      if (granted) {
        console.log('Notification permission granted.');
      }

      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        const token = await messaging().getToken();
        console.log('FCM token:', token);

        try {
          await messaging().subscribeToTopic('refuges');
          console.log('Subscribed to topic');
        } catch (error) {
          console.error('Error subscribing to topic:', error);
        }
      }
    };

    requestUserPermission();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
