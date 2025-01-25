import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import { useSelector, useDispatch } from "react-redux";
import { fetchAccessibleRefuges } from "../redux/actions/refugeActions";
import { FontAwesome } from "@expo/vector-icons";

const RefugeListScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { refuges, error } = useSelector((state) => state.refuges);
  const [filteredRefuges, setFilteredRefuges] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const searchQuery = route.params?.searchQuery || ""; // Récupérer le texte de recherche

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
      const userLocation = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };

      setUserLocation(userLocation); // Définir la position réelle
      dispatch(fetchAccessibleRefuges(userLocation)); // Charger les refuges
      setLoading(false);

      // Mettre à jour la position en temps réel
      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Mettre à jour toutes les 5 secondes
          distanceInterval: 10, // Mettre à jour tous les 10 mètres
        },
        (newLocation) => {
          const updatedLocation = {
            lat: newLocation.coords.latitude,
            lng: newLocation.coords.longitude,
          };
          setUserLocation(updatedLocation);
        }
      );

      // Nettoyer l'abonnement lors du démontage du composant
      return () => {
        if (locationSubscription) {
          locationSubscription.remove();
        }
      };
    })();
  }, [dispatch]);

  useEffect(() => {
    if (userLocation) {
      dispatch(fetchAccessibleRefuges(userLocation)); // Charger les refuges avec la position réelle
    }
  }, [dispatch, userLocation]);

  useEffect(() => {
    // Appliquer le filtrage des refuges si une recherche est effectuée
    if (searchQuery) {
      const filtered = refuges.filter((refuge) =>
        refuge.nom.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRefuges(filtered);
    } else {
      setFilteredRefuges(refuges);
    }
  }, [refuges, searchQuery]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E1E4A" />
        <Text>Chargement des refuges...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erreur : {error}</Text>
      </View>
    );
  }

  if (!userLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E1E4A" />
        <Text>Chargement de la position...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Bouton Retour */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <FontAwesome name="arrow-left" size={20} color="#FFF" />
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredRefuges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.refugeItem}>
            <Text style={styles.refugeName}>{item.nom}</Text>
            <Text style={styles.refugeDetails}>Commune : {item.commune}</Text>
            <Text style={styles.refugeDetails}>
              Distance : {item.distanceText}
            </Text>
            <Text style={styles.refugeDetails}>Type : {item.type}</Text>
            {/* Bouton pour navigation en temps réel */}
            <TouchableOpacity
              style={styles.navigateButton}
              onPress={() =>
                navigation.navigate("RealTimeNavigation", {
                  destination: {
                    latitude: item.location.lat,
                    longitude: item.location.lng,
                  },
                  destinationDetails: item.nom,
                  currentLocation: userLocation, // Utiliser la position réelle
                  distanceText: item.distanceText,
                })
              }
            >
              <Text style={styles.navigateButtonText}>
                Naviguer vers ce refuge
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noResultsText}>
            {searchQuery
              ? "Aucun refuge correspondant à votre recherche."
              : "Aucun refuge accessible trouvé."}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E4A",
    padding: 10,
    borderRadius: 5,
    marginBottom: 32,
    alignSelf: "flex-start",
    marginTop: 40,
  },
  backButtonText: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 8,
  },
  refugeItem: {
    backgroundColor: "#f1f1f1",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  refugeName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  refugeDetails: {
    fontSize: 14,
    color: "#555",
  },
  navigateButton: {
    marginTop: 10,
    backgroundColor: "#1E1E4A",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  navigateButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  noResultsText: {
    textAlign: "center",
    color: "#555",
    fontSize: 16,
    marginTop: 20,
  },
});

export default RefugeListScreen;
