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
import SimulateAlertScreen from '../screens/SimulateAlertScreen'; // Nouvel écran pour simuler une alerte
import CustomDrawerContent from '../components/CustomDrawerContent'; // Contenu personnalisé du Drawer

// Déclarations des stacks et du drawer
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
      {/* Home Screen */}
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          title: 'Accueil',
        }}
      />

      {/* Alert Screen */}
      <Drawer.Screen
        name="Alert"
        component={AlertScreen}
        options={{
          drawerIcon: ({ color }) => <Ionicons name="notifications" size={24} color={color} />,
          title: 'Alerte',
        }}
      />

      {/* Settings Screen */}
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
          title: 'Paramètres',
        }}
      />

      {/* Account Screen */}
      <Drawer.Screen
        name="Account"
        component={AccountScreen}
        options={{
          drawerIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
          title: 'Mon Compte',
        }}
      />

      {/* Contact Screen */}
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
        {/* Splash Screen */}
        <Stack.Screen name="Splash" component={SplashScreen} />

        {/* Login Screen */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Register Screen */}
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* Main App (Drawer Navigation) */}
        <Stack.Screen name="MainApp" component={DrawerNavigator} />

        {/* Simulate Alert Screen */}
        <Stack.Screen
          name="SimulateAlert"
          component={SimulateAlertScreen}
          options={{ title: 'Simuler une Alerte' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
