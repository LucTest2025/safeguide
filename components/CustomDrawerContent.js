import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/actions/authActions';

const CustomDrawerContent = (props) => {
  const dispatch = useDispatch();
  const { firstName, lastName, photo, handicap } = useSelector((state) => state.auth); // Accéder directement au Redux store

  const handleLogout = () => {
    // Logique de déconnexion
    dispatch(logoutUser());
    props.navigation.replace('Login'); // Redirige vers l'écran de connexion
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      {/* Section d'en-tête */}
      <View style={styles.header}>
        <Image
          source={photo ? { uri: photo } : require('../assets/default-avatar.png')} // Photo utilisateur ou par défaut
          style={styles.profileImage}
        />
        <Text style={styles.name}>{`${firstName || 'User'} ${lastName || ''}`}</Text>
        <Text style={styles.userInfo}>{`Handicap: ${handicap || 'Not specified'}`}</Text>
      </View>

      {/* Éléments de menu */}
      <View style={styles.menuItems}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => props.navigation.navigate('Home')}
        >
          <MaterialIcons name="home" size={24} color="#000" />
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => props.navigation.navigate('Account')}
        >
          <MaterialIcons name="person" size={24} color="#000" />
          <Text style={styles.menuText}>Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => props.navigation.navigate('Contact')}
        >
          <MaterialIcons name="phone" size={24} color="#000" />
          <Text style={styles.menuText}>Contact</Text>
        </TouchableOpacity>

        {/* Ajout de l'élément Alerte */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => props.navigation.navigate('Alert')}
        >
          <MaterialIcons name="notifications" size={24} color="#000" />
          <Text style={styles.menuText}>Alerte</Text>
        </TouchableOpacity>
      </View>

      {/* Bouton de déconnexion */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#1E1E4A',
    padding: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  userInfo: {
    fontSize: 14,
    color: '#ccc',
  },
  menuItems: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 20,
    color: '#000',
  },
  logoutContainer: {
    marginTop: 'auto',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  logoutButton: {
    backgroundColor: '#1E1E4A',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomDrawerContent;
