import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { useSelector, useDispatch } from "react-redux";
import { fetchAccessibleRefuges, fetchRefugePhotos } from "../redux/actions/refugeActions";
import { FontAwesome } from "@expo/vector-icons";

const RefugeListScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();

  // Récupérer les données Redux
  const { refuges, loading, error, photos } = useSelector((state) => state.refuges);
  
  const searchQuery = route.params?.searchQuery || "";

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
      const userLocation = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };

      // Lancer la récupération des refuges avec Redux
      dispatch(fetchAccessibleRefuges(userLocation));
    })();
  }, [dispatch]);

  useEffect(() => {
    if (refuges.length > 0) {
      dispatch(fetchRefugePhotos(refuges)); // Charger les photos une seule fois
    }
  }, [dispatch, refuges]);

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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={20} color="#FFF" />
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>

      <FlatList
        data={refuges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Affichage de la photo */}
            {photos[item.place_id] ? (
              <Image source={{ uri: photos[item.place_id] }} style={styles.cardImage} />
            ) : (
              <View style={styles.noImageContainer}>
                <Text style={styles.noImageText}>Image non disponible</Text>
              </View>
            )}

            {/* Contenu du refuge */}
            <View style={styles.cardContent}>
              <Text style={styles.refugeName}>{item.nom}</Text>
              <Text style={styles.refugeDetails}>Commune : {item.commune}</Text>
              <Text style={styles.refugeDetails}>Distance : {item.distanceText}</Text>
              <Text style={styles.refugeDetails}>Type : {item.type}</Text>

              {/* Bouton de navigation */}
              <TouchableOpacity
                style={styles.navigateButton}
                onPress={() =>
                  navigation.navigate("RealTimeNavigation", {
                    destination: {
                      latitude: item.location.lat,
                      longitude: item.location.lng,
                    },
                    destinationDetails: item.nom,
                    distanceText: item.distanceText,
                  })
                }
              >
                <Text style={styles.navigateButtonText}>Naviguer vers ce refuge</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noResultsText}>Aucun refuge accessible trouvé.</Text>}
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
    marginBottom: 16,
    alignSelf: "flex-start",
    marginTop: 56, // 🔹 Ajuste cette valeur pour descendre le bouton
  },
  
  backButtonText: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 8,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3, // Ombre Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardImage: {
    width: "100%",
    height: 150,
  },
  noImageContainer: {
    width: "100%",
    height: 150,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    color: "#555",
  },
  cardContent: {
    padding: 16,
  },
  refugeName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  refugeDetails: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  navigateButton: {
    marginTop: 12,
    backgroundColor: "#1E1E4A",
    paddingVertical: 12,
    paddingHorizontal: 20,
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
