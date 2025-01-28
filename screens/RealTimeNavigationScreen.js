import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { GOOGLE_MAPS_API_KEY } from '@env';

const { width, height } = Dimensions.get('window');

const RealTimeNavigationScreen = ({ route, navigation }) => {
  const { destination, destinationDetails } = route.params;
  const [routeCoords, setRouteCoords] = useState([]);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const mapViewRef = useRef(null);

  // Fonction de formatage de la durée
  const formatDuration = (duration) => {
    const durationRegex = /(\d+)\s*hour[s]?\s*(\d+)?\s*min[s]?/i;
    const match = duration.match(durationRegex);

    if (match) {
      const hours = match[1] ? `${match[1]}h` : ''; // Convertir "hours" en "h"
      const minutes = match[2] ? `${match[2]}min` : ''; // Convertir "mins" en "min"
      return `${hours} ${minutes}`.trim();
    }

    // Si seule la durée en minutes est disponible
    return duration.replace(/min[s]?/i, 'min').trim();
  };

  // Initialisation de la localisation et de l'itinéraire
  useEffect(() => {
    initializeLocationTracking();
  }, []);

  const initializeLocationTracking = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Erreur',
          "L'accès à la localisation est requis pour utiliser cette fonctionnalité."
        );
        setLoading(false);
        return;
      }

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 50,
        },
        (location) => {
          const newLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };

          setCurrentLocation(newLocation);
        }
      );
    } catch (error) {
      console.error('Erreur de localisation:', error);
      Alert.alert('Erreur', 'Impossible d’accéder à la localisation.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentLocation && destination) {
      loadRoute(currentLocation, destination, true); // Essayer l'itinéraire PMR en premier
    }
  }, [currentLocation, destination]);

  const loadRoute = async (origin, destinationCoords, pmrAttempt) => {
    try {
      const mode = 'walking';
      const avoid = pmrAttempt ? 'stairs' : ''; // Si PMR, éviter les escaliers
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destinationCoords.latitude},${destinationCoords.longitude}&mode=${mode}&avoid=${avoid}&language=fr&key=${GOOGLE_MAPS_API_KEY}`
      );

      const data = await response.json();

      if (data.status !== 'OK') {
        if (pmrAttempt) {
          console.warn('Aucun itinéraire PMR trouvé. Passage à un itinéraire normal.');
          loadRoute(origin, destinationCoords, false); // Retenter avec un itinéraire standard
        } else {
          Alert.alert('Erreur', 'Impossible de trouver un itinéraire.');
        }
        return;
      }

      const route = data.routes[0];
      const points = decodePolyline(route.overview_polyline.points);

      setRouteCoords(points);

      const leg = route.legs[0];
      setDistance(leg.distance.text);
      setDuration(formatDuration(leg.duration.text)); // Appliquer le formatage de la durée

      const instructions = leg.steps.map((step) => ({
        text: step.html_instructions.replace(/<[^>]*>/g, ''), // Supprimer les balises HTML
        endLocation: step.end_location,
        distance: step.distance.text,
        duration: step.duration.text,
      }));
      setSteps(instructions);

      if (pmrAttempt) {
        console.log('Itinéraire PMR chargé avec succès.');
      } else {
        console.log('Itinéraire standard chargé.');
      }
    } catch (error) {
      console.error('Erreur de chargement de l’itinéraire:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors du chargement de l’itinéraire.');
    } finally {
      setLoading(false);
    }
  };

  const decodePolyline = (t) => {
    let points = [];
    let index = 0,
      len = t.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = t.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = result = 0;
      do {
        b = t.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }

    return points;
  };

  const recenterRoute = () => {
    if (mapViewRef.current && currentLocation) {
      mapViewRef.current.animateToRegion(currentLocation, 1000);
    }
  };

  if (!currentLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E1E4A" />
        <Text style={styles.loadingText}>Chargement de la localisation...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView ref={mapViewRef} style={styles.map} showsUserLocation={true}>
        {currentLocation && (
          <Marker coordinate={currentLocation} title="Vous êtes ici" pinColor="green" />
        )}
        {destination && (
          <Marker coordinate={destination} title="Destination" pinColor="red" />
        )}
        {routeCoords.length > 0 && (
          <Polyline coordinates={routeCoords} strokeWidth={4} strokeColor="blue" />
        )}
      </MapView>

      <View style={styles.instructionBox}>
        <Text style={styles.instructionText}>
          {steps[currentStepIndex]?.text || 'Navigation terminée'}
        </Text>
      </View>

      <View style={styles.bottomPanel}>
        <Text style={styles.distanceText}>Distance : {distance}</Text>
        <Text style={styles.durationText}>Durée : {duration}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.contactButton} onPress={() => navigation.navigate('Contact')}>
          <Text style={styles.contactText}>Contact</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.goBack()}>
          <Text style={styles.homeText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.recenterButton} onPress={recenterRoute}>
          <Text style={styles.recenterText}>Recentrer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
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
  instructionBox: {
    position: 'absolute',
    top: height * 0.07,
    left: width * 0.05,
    right: width * 0.05,
    backgroundColor: '#1E1E4A',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  instructionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomPanel: {
    position: 'absolute',
    bottom: height * 0.03,
    left: width * 0.05,
    right: width * 0.05,
    backgroundColor: '#1E1E4A',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  durationText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: height * 0.12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    alignSelf: 'center',
  },
  contactButton: {
    backgroundColor: '#1E1E4A',
    width: width * 0.25,
    height: height * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 5,
  },
  contactText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  homeButton: {
    backgroundColor: '#1E1E4A',
    width: width * 0.25,
    height: height * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 5,
  },
  homeText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  recenterButton: {
    backgroundColor: '#1E1E4A',
    width: width * 0.25,
    height: height * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 5,
  },
  recenterText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RealTimeNavigationScreen;
