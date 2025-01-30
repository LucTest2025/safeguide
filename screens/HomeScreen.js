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
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "L’application a besoin de la permission de localisation pour fonctionner."
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
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

      return () => {
        if (locationSubscription) {
          locationSubscription.remove();
        }
      };
    })();
  }, []);

  useEffect(() => {
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
    navigation.navigate("RefugeList", {
      userLocation: userLocation,
      searchQuery: destination.trim() || undefined,
    });
  };

  const handleSearchInput = (text) => {
    setDestination(text);
    setIsSearching(text.trim() !== "");
  };

  if (!userLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E1E4A" accessibilityLabel="Chargement en cours" />
        <Text style={styles.loadingText}>Chargement de la position...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapViewRef}
        style={styles.map}
        region={userLocation}
        showsUserLocation
        accessibilityLabel="Carte interactive affichant votre position et les refuges disponibles"
      >
        {userLocation && <Marker coordinate={userLocation} title="Vous êtes ici" />} 
      </MapView>

      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
          accessibilityLabel="Ouvrir le menu"
          accessible={true}
        >
          <Entypo name="menu" size={width * 0.06} color="#000" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Chercher un refuge"
          placeholderTextColor="#6B6B6B"
          value={destination}
          onChangeText={handleSearchInput}
          accessibilityLabel="Champ de recherche pour un refuge"
          importantForAccessibility="yes"
        />
      </View>

      <TouchableOpacity
        style={styles.goNowButton}
        onPress={handleGoNow}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={isSearching ? "Voir le refuge sélectionné" : "Voir tous les refuges"}
      >
        <Text style={styles.goNowText}>{isSearching ? "Voir le refuge" : "Voir les refuges"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.recenterButton}
        onPress={recenterMap}
        accessible={true}
        accessibilityLabel="Recentrer la carte sur votre position"
      >
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#1E1E4A",
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
