import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const handleExploreNow = () => {
    // Navigue vers l'écran Login
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../assets/logo.png')} // Remplacez ce chemin par le chemin réel de votre logo
        style={styles.logo}
      />
      <Text style={styles.title}>Safe Guide</Text>
      <TouchableOpacity style={styles.button} onPress={handleExploreNow}>
        <Text style={styles.buttonText}>Explore Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E4A',
  },
  logo: {
    width: width * 0.3, // 30% de la largeur de l'écran
    height: width * 0.3, // Hauteur égale à la largeur pour un carré
    marginBottom: height * 0.02, // Espace entre le logo et le titre
  },
  title: {
    fontSize: width * 0.08, // 8% de la largeur de l'écran
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: height * 0.03, // Espace entre le titre et le bouton
  },
  button: {
    backgroundColor: '#7267F0',
    paddingVertical: height * 0.015, // Ajusté en fonction de la hauteur de l'écran
    paddingHorizontal: width * 0.15, // Ajusté en fonction de la largeur de l'écran
    borderRadius: width * 0.02, // Rayon des coins ajusté proportionnellement
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045, // 4.5% de la largeur de l'écran
    fontWeight: 'bold',
  },
});

export default SplashScreen;
