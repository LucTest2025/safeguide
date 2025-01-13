import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons'; // Pour l'icône de l'alerte
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window'); // Dimensions de l'écran

const SimulateAlertScreen = () => {
  const [sound, setSound] = useState();
  const [bannerVisible, setBannerVisible] = useState(false);
  const navigation = useNavigation();

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/alert-sound.mp3') // Chemin du fichier audio
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Erreur lors de la lecture du son :', error);
    }
  };

  const handleTriggerAlert = () => {
    playSound(); // Jouer le son
    setBannerVisible(true); // Afficher la bannière
  };

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync(); // Nettoyage du son
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      {/* Bouton retour */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Bannière visible en cas d'alerte */}
      {bannerVisible && (
        <View style={styles.banner}>
          <Ionicons name="alert-circle" size={36} color="#FFF" style={styles.icon} />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Tsunami à l’approche</Text>
            <Text style={styles.bannerSubtitle}>Mettez-vous à l'abri !</Text>
          </View>
        </View>
      )}

      {/* Contenu principal */}
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Simulation d'Alerte Tsunami</Text>
      <TouchableOpacity style={styles.triggerButton} onPress={handleTriggerAlert}>
        <Text style={styles.buttonText}>DÉCLENCHER</Text>
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
    padding: width * 0.05,
  },
  backButton: {
    position: 'absolute',
    top: height * 0.05,
    left: width * 0.05,
    backgroundColor: '#2C2C54',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  logo: {
    width: width * 0.25,
    height: width * 0.25,
    resizeMode: 'contain',
    marginBottom: height * 0.03,
  },
  title: {
    fontSize: width * 0.06,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: height * 0.05,
    textAlign: 'center',
  },
  triggerButton: {
    backgroundColor: '#FF5252',
    borderRadius: width * 0.05,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.2,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  banner: {
    position: 'absolute',
    top: height * 0.15,
    backgroundColor: '#FF5252',
    borderRadius: width * 0.03,
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.05,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    marginRight: width * 0.03,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#FFF',
  },
  bannerSubtitle: {
    fontSize: width * 0.04,
    color: '#FFF',
  },
});

export default SimulateAlertScreen;
