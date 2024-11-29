import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import MapView from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  let mapViewRef = null; // Référence pour MapView

  const recenterMap = () => {
    if (mapViewRef) {
      mapViewRef.animateToRegion(
        {
          latitude: 48.8566,
          longitude: 2.3522,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        },
        1000 // Animation de 1 seconde
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Map avec OpenStreetMap */}
      <MapView
        ref={(ref) => (mapViewRef = ref)} // Assigne la référence pour le recentrage
        style={styles.map}
        initialRegion={{
          latitude: 48.8566, // Centre de l'Île-de-France
          longitude: 2.3522,
          latitudeDelta: 0.5, // Ajustez pour zoomer/dézoomer
          longitudeDelta: 0.5,
        }}
        tileUrlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // Tuiles OpenStreetMap
        urlTileSource={{
          urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        }}
      />

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        {/* Bouton Menu */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Entypo name="menu" size={width * 0.06} color="#000" />
        </TouchableOpacity>

        {/* Input Recherche */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a location"
          placeholderTextColor="#A1A1A1"
          value={search}
          onChangeText={setSearch}
        />

        {/* Bouton de recherche */}
        <TouchableOpacity
          style={styles.searchIcon}
          onPress={() => {
            console.log(`Searching for: ${search}`);
            alert(`Searching for: ${search}`);
          }}
        >
          <FontAwesome name="search" size={width * 0.05} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Bouton Go Now */}
      <TouchableOpacity
        style={styles.goNowButton}
        onPress={() => alert('Navigating...')}
      >
        <Text style={styles.goNowText}>Go Now</Text>
      </TouchableOpacity>

      {/* Bouton recentrer */}
      <TouchableOpacity style={styles.recenterButton} onPress={recenterMap}>
        <Text style={styles.recenterText}>Recenter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: height * 0.08,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: width * 0.02,
    marginHorizontal: width * 0.05,
    padding: width * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  menuButton: {
    marginRight: width * 0.03,
  },
  searchInput: {
    flex: 1,
    height: height * 0.05,
    fontSize: width * 0.04,
    color: '#000',
  },
  searchIcon: {
    marginLeft: width * 0.03,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  goNowText: {
    color: '#FFFFFF',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  recenterButton: {
    position: 'absolute',
    bottom: height * 0.25,
    right: width * 0.05,
    backgroundColor: '#1E1E4A',
    borderRadius: width * 0.02,
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  recenterText: {
    color: '#FFFFFF',
    fontSize: width * 0.035,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
