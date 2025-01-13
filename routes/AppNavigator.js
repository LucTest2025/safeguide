import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import des écrans
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import AccountScreen from '../screens/AccountScreen';
import ContactScreen from '../screens/ContactScreen';
import AlertScreen from '../screens/AlertScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SimulateAlertScreen from '../screens/SimulateAlertScreen';
import RealTimeNavigationScreen from '../screens/RealTimeNavigationScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import RefugeListScreen from '../screens/RefugeListScreen';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Composant de Drawer Navigation
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: '#7267F0',
        drawerInactiveTintColor: '#000',
        drawerStyle: {
          backgroundColor: '#FFF',
          width: 250,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          title: 'Accueil',
        }}
      />
      <Drawer.Screen
        name="Alert"
        component={AlertScreen}
        options={{
          drawerIcon: ({ color }) => <Ionicons name="notifications" size={24} color={color} />,
          title: 'Alerte',
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
          title: 'Paramètres',
        }}
      />
      <Drawer.Screen
        name="Account"
        component={AccountScreen}
        options={{
          drawerIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
          title: 'Mon Compte',
        }}
      />
      <Drawer.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          drawerIcon: ({ color }) => <Ionicons name="call" size={24} color={color} />,
          title: 'Contact',
        }}
      />
    </Drawer.Navigator>
  );
};

// App Navigator principal (Stack Navigation)
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animationEnabled: true,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainApp" component={DrawerNavigator} />
        <Stack.Screen
          name="SimulateAlert"
          component={SimulateAlertScreen}
          options={{ title: 'Simuler une Alerte' }}
        />
        <Stack.Screen
          name="RealTimeNavigation"
          component={RealTimeNavigationScreen}
          options={{ title: 'Navigation en Temps Réel' }}
        />
        <Stack.Screen
          name="Contact"
          component={ContactScreen}
          options={{ title: 'Contact' }}
        />
        <Stack.Screen name="RefugeList" component={RefugeListScreen} />
        {/* Ajout de l'écran Home via le DrawerNavigator, nommé différemment */}
        <Stack.Screen
          name="HomeDrawer"
          component={DrawerNavigator}
          options={{
            headerShown: false,
            title: 'Accueil',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
