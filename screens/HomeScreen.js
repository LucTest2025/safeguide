import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { Entypo } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const mapViewRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    (async () => {
      // Demander la permission d'accéder à la localisation
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "L’application a besoin de la permission de localisation pour fonctionner."
        );
        return;
      }

      // Obtenir la position actuelle de l'utilisateur
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      // Mettre à jour la position en temps réel
      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Mettre à jour toutes les 5 secondes
          distanceInterval: 10, // Mettre à jour tous les 10 mètres
        },
        (newLocation) => {
          setUserLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      );

      // Nettoyer l'abonnement lors du démontage du composant
      return () => {
        if (locationSubscription) {
          locationSubscription.remove();
        }
      };
    })();
  }, []);

  useEffect(() => {
    // Simuler la récupération de la position
    if (userLocation) {
      setLocation(userLocation);
    }
  }, [userLocation]);

  const recenterMap = () => {
    if (mapViewRef.current && userLocation) {
      mapViewRef.current.animateToRegion(userLocation, 1000);
    }
  };

  const handleGoNow = () => {
    if (isSearching && destination.trim() !== "") {
      // Navigation pour un refuge spécifique
      navigation.navigate("RefugeList", {
        userLocation: userLocation, // Utiliser la position réelle
        searchQuery: destination.trim(), // Envoyer la recherche au composant RefugeList
      });
    } else {
      // Navigation pour voir tous les refuges
      navigation.navigate("RefugeList", {
        userLocation: userLocation, // Utiliser la position réelle
      });
    }
  };

  const handleSearchInput = (text) => {
    setDestination(text);
    setIsSearching(text.trim() !== ""); // Activer la recherche si un texte est saisi
  };

  if (!userLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E1E4A" />
        <Text style={styles.loadingText}>Chargement de la position...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapViewRef}
        style={styles.map}
        region={userLocation} // Utiliser la position réelle
        showsUserLocation
      >
        {userLocation && (
          <Marker coordinate={userLocation} title="Vous êtes ici" />
        )}
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
          {isSearching ? "Voir le refuge" : "Voir les refuges"}
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
    position: "absolute",
    top: height * 0.08,
    left: width * 0.05,
    right: width * 0.05,
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#1E1E4A',
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: "#F1F1F1",
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#333",
    marginRight: 10,
  },
  goNowButton: {
    position: "absolute",
    bottom: height * 0.1,
    alignSelf: "center",
    backgroundColor: "#1E1E4A",
    borderRadius: width * 0.5,
    width: width * 0.25,
    height: width * 0.25,
    justifyContent: "center",
    alignItems: "center",
  },
  goNowText: {
    color: "#FFFFFF",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  recenterButton: {
    position: "absolute",
    bottom: height * 0.3,
    right: width * 0.05,
    backgroundColor: "#1E1E4A",
    padding: 10,
    borderRadius: 10,
  },
  recenterText: {
    color: "#FFF",
    fontSize: 14,
  },
});

export default HomeScreen;
