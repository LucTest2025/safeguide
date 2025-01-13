import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Dimensions,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Entypo } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const mapViewRef = useRef(null);

  // Position fictive pour les tests
  const mockLocation = {
    latitude: -12.7829, // Latitude de l'Hôtel Hamaha Beach
    longitude: 45.2278, // Longitude de l'Hôtel Hamaha Beach
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  useEffect(() => {
    // Simuler la récupération de la position
    setLocation(mockLocation);
  }, []);

  const recenterMap = () => {
    if (mapViewRef.current && location) {
      mapViewRef.current.animateToRegion(location, 1000);
    }
  };

  const handleGoNow = () => {
    if (isSearching && destination.trim() !== '') {
      // Navigation pour un refuge spécifique
      navigation.navigate('RefugeList', {
        userLocation: mockLocation,
        searchQuery: destination.trim(), // Envoyer la recherche au composant RefugeList
      });
    } else {
      // Navigation pour voir tous les refuges
      navigation.navigate('RefugeList', {
        userLocation: mockLocation,
      });
    }
  };

  const handleSearchInput = (text) => {
    setDestination(text);
    setIsSearching(text.trim() !== ''); // Activer la recherche si un texte est saisi
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapViewRef}
        style={styles.map}
        region={location}
        showsUserLocation
      >
        {location && <Marker coordinate={location} title="Vous êtes ici" />}
      </MapView>

      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Entypo name="menu" size={width * 0.06} color="#000" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Chercher un refuge"
          placeholderTextColor="#A1A1A1"
          value={destination}
          onChangeText={handleSearchInput}
        />
      </View>

      <TouchableOpacity style={styles.goNowButton} onPress={handleGoNow}>
        <Text style={styles.goNowText}>
          {isSearching ? 'Voir le refuge' : 'Voir les refuges'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.recenterButton} onPress={recenterMap}>
        <Text style={styles.recenterText}>Recentrer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  searchContainer: {
    position: 'absolute',
    top: height * 0.08,
    left: width * 0.05,
    right: width * 0.05,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#F1F1F1',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  goNowButton: {
    position: 'absolute',
    bottom: height * 0.1,
    alignSelf: 'center',
    backgroundColor: '#1E1E4A',
    borderRadius: width * 0.5,
    width: width * 0.25,
    height: width * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goNowText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  recenterButton: {
    position: 'absolute',
    bottom: height * 0.3,
    right: width * 0.05,
    backgroundColor: '#1E1E4A',
    padding: 10,
    borderRadius: 10,
  },
  recenterText: {
    color: '#FFF',
    fontSize: 14,
  },
});

export default HomeScreen;
