import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAccessibleRefuges } from '../redux/actions/refugeActions';
import { FontAwesome } from '@expo/vector-icons';

const RefugeListScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { refuges, error } = useSelector((state) => state.refuges);
  const [filteredRefuges, setFilteredRefuges] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const searchQuery = route.params?.searchQuery || ''; // Récupérer le texte de recherche

  useEffect(() => {
    // Position fictive de l'utilisateur
    const fixedLocation = {
      lat: -12.7806, // Latitude de Mamoudzou
      lng: 45.2278, // Longitude de Mamoudzou
    };

    setUserLocation(fixedLocation); // Définir la position fixe
    dispatch(fetchAccessibleRefuges(fixedLocation)); // Charger les refuges
    setLoading(false);
  }, [dispatch]);

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
                navigation.navigate('RealTimeNavigation', {
                  destination: {
                    latitude: item.location.lat,
                    longitude: item.location.lng,
                  },
                  destinationDetails: item.nom,
                  currentLocation: userLocation,
                  distanceText: item.distanceText, // Transmettre la distance au composant de navigation
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
              ? 'Aucun refuge correspondant à votre recherche.'
              : 'Aucun refuge accessible trouvé.'}
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
    backgroundColor: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E4A',
    padding: 10,
    borderRadius: 5,
    marginBottom: 32,
    alignSelf: 'flex-start',
    marginTop: 40,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 8,
  },
  refugeItem: {
    backgroundColor: '#f1f1f1',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  refugeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  refugeDetails: {
    fontSize: 14,
    color: '#555',
  },
  navigateButton: {
    marginTop: 10,
    backgroundColor: '#1E1E4A',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  navigateButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 16,
    marginTop: 20,
  },
});

export default RefugeListScreen;
