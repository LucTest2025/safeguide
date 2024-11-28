import React, { useEffect } from 'react';
import { Alert, PermissionsAndroid, ActivityIndicator } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/Home';
import Setting from './components/Setting';

const Stack = createStackNavigator();
const NAVIGATION_IDS = ["home", "settings"];

function buildDeepLinkFromNotificationData(data) {
  const navigationId = data?.navigationId;
  if (!NAVIGATION_IDS.includes(navigationId)) {
    console.warn('Unverified navigationId', navigationId);
    return null;
  }
  if (navigationId === "home") {
    return 'myapp://home';
  }
  if (navigationId === "settings") {
    return 'myapp://settings';
  }
  return null;
}

const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      Home: "home",
      Settings: "settings",
    },
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (typeof url === 'string') {
      return url;
    }
    const message = await messaging().getInitialNotification();
    const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
    if (typeof deeplinkURL === 'string') {
      return deeplinkURL;
    }
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }) => listener(url);

    const linkingSubscription = Linking.addEventListener('url', onReceiveURL);

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    const foreground = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
      Alert.alert(
        remoteMessage.notification?.title || 'Notification',
        remoteMessage.notification?.body || 'No message body'
      );
    });

    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      const url = buildDeepLinkFromNotificationData(remoteMessage.data);
      if (typeof url === 'string') {
        listener(url);
      }
    });

    return () => {
      linkingSubscription.remove();
      unsubscribe();
      foreground();
    };
  },
};

function App() {
  useEffect(() => {
    const requestUserPermission = async () => {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
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
    <NavigationContainer linking={linking} fallback={<ActivityIndicator animating />}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Settings" component={Setting} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
