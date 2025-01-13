import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Pour l'icône du bouton retour

const AlertScreen = () => {
  const navigation = useNavigation();

  const handleConfigureNotifications = () => {
    navigation.navigate('Settings'); // Naviguer vers l'écran des paramètres
  };

  const handleSimulateAlert = () => {
    navigation.navigate('SimulateAlert'); // Naviguer vers l'écran de simulation d'alerte
  };

  return (
    <View style={styles.container}>
      {/* Bouton Retour */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Contenu principal */}
      <Image
        source={require('../assets/logo.png')} // Assurez-vous que le logo est dans le dossier assets
        style={styles.logo}
      />
      <Text style={styles.title}>SafeGuide - Alerte Tsunami</Text>
      <TouchableOpacity
        style={styles.configureButton}
        onPress={handleConfigureNotifications}
      >
        <Text style={styles.buttonText}>Configurer les Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.alertButton}
        onPress={handleSimulateAlert}
      >
        <Text style={styles.buttonText}>Simuler une Alerte</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E4A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40, // Ajustez en fonction de l'espace souhaité
    left: 20, // Ajustez en fonction de l'espace souhaité
    backgroundColor: '#2C2C54',
    borderRadius: 20,
    padding: 10,
    elevation: 5,
    zIndex: 10,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  configureButton: {
    backgroundColor: '#7267F0',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  alertButton: {
    backgroundColor: '#FF5252',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AlertScreen;
