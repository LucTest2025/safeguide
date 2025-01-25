import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  Switch,
} from 'react-native';
import * as Speech from 'expo-speech';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { GOOGLE_MAPS_API_KEY } from '@env';

const { width, height } = Dimensions.get('window');

const RealTimeNavigationScreen = ({ route, navigation }) => {
  const { destination, destinationDetails, distanceText } = route.params;

  // Position fictive définie en dur
  const mockLocation = {
    latitude: -12.7829, // Latitude de l'Hôtel Hamaha Beach
    longitude: 45.2278, // Longitude de l'Hôtel Hamaha Beach
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const [routeCoords, setRouteCoords] = useState([]);
  const [steps, setSteps] = useState([]);
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [currentAudioStep, setCurrentAudioStep] = useState(null);
  const mapViewRef = useRef(null);

  // Fonction pour formater la durée
  const formatDuration = (duration) => {
    const durationRegex = /(\d+)\s*hour[s]?\s*(\d+)?\s*min[s]?/i;
    const match = duration.match(durationRegex);

    if (match) {
      const hours = match[1] ? `${match[1]}h` : ''; // Convertir "hour" en "h"
      const minutes = match[2] ? `${match[2]}min` : ''; // Convertir "mins" en "min"
      return `${hours} ${minutes}`.trim();
    }

    // Si seulement les minutes sont fournies
    return duration.replace(/min[s]?/i, 'min').trim();
  };

  // Charger la route entre le départ (mockLocation) et la destination
  useEffect(() => {
    if (mockLocation && destination) {
      loadRoute(mockLocation, destination);
    }
  }, [mockLocation, destination]);

  useEffect(() => {
    if (isAudioEnabled && steps.length > 0) {
      const nextStep = steps[0]?.text;
      if (currentAudioStep !== nextStep) {
        playAudio(nextStep);
        setCurrentAudioStep(nextStep);
      }
    }
  }, [steps, isAudioEnabled, currentAudioStep]);    

  const loadRoute = async (origin, destinationCoords) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destinationCoords.latitude},${destinationCoords.longitude}&mode=walking&language=fr&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
  
      if (data.status !== 'OK') {
        Alert.alert('Erreur', 'Impossible de trouver un itinéraire.');
        return;
      }
  
      const route = data.routes[0];
      const points = decodePolyline(route.overview_polyline.points);
  
      setRouteCoords(points);
  
      const leg = route.legs[0];
      setDuration(formatDuration(leg.duration.text)); // Formatage de la durée
  
      const instructions = leg.steps.map((step) => {
        // Convertir la distance en mètres
        const distanceInMeters = step.distance.value; // La distance en mètres est disponible dans `value`
        const distanceText = `${distanceInMeters} m`; // Afficher en mètres
  
        return {
          text: step.html_instructions
            .replace(/<[^>]*>/g, '') // Supprime les balises HTML
            .trim(), // Supprime les espaces en trop
          endLocation: step.end_location,
          distance: distanceText, // Utiliser la distance en mètres
          duration: step.duration.text,
        };
      });
  
      // Filtrer en favorisant la dernière occurrence
      const filteredInstructions = instructions.reduce((acc, instruction) => {
        const duplicateIndex = acc.findIndex((prevInstruction) => {
          return (
            prevInstruction.text === instruction.text ||
            Math.abs(
              parseFloat(instruction.distance.replace(',', '.')) -
              parseFloat(prevInstruction.distance.replace(',', '.'))
            ) < 0.1 // Tolérance pour les distances similaires
          );
        });
  
        // Si un doublon est trouvé, remplacez-le par la nouvelle instruction
        if (duplicateIndex !== -1) {
          acc[duplicateIndex] = instruction;
        } else {
          acc.push(instruction); // Sinon, ajoutez l'instruction au tableau final
        }
  
        return acc;
      }, []);
  
      setSteps(filteredInstructions);
    } catch (error) {
      console.error('Erreur lors du chargement de l’itinéraire :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors du chargement de l’itinéraire.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const updateInstructions = () => {
      setSteps((prevSteps) => {
        const userPosition = mockLocation; // Remplace par la localisation réelle
        const nextStepIndex = prevSteps.findIndex(
          (step) =>
            step.endLocation.latitude > userPosition.latitude &&
            step.endLocation.longitude > userPosition.longitude
        );
  
        if (nextStepIndex !== -1) {
          return [prevSteps[nextStepIndex]]; // Garder uniquement l'étape en cours
        }
  
        // Si l'utilisateur a terminé toutes les étapes
        if (prevSteps.length === 0) {
          Alert.alert("Arrivé à destination", "Vous êtes arrivé à destination !");
          return [];
        }
  
        return prevSteps;
      });
    };
  
    const interval = setInterval(updateInstructions, 3000); // Mettre à jour toutes les 3 secondes
    return () => clearInterval(interval);
  }, [mockLocation]);  

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

  const playAudio = (text) => {
    Speech.speak(text, {
      language: 'fr-FR',
      pitch: 1.0,
      rate: 1.0,
    });
  };  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E1E4A" />
        <Text style={styles.loadingText}>Chargement de l'itinéraire...</Text>
      </View>
    );
  }

  if (steps.length === 0 && !loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Vous êtes arrivé à destination !</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView ref={mapViewRef} style={styles.map} showsUserLocation>
        {/* Marqueur pour la position fictive */}
        {mockLocation && (
          <Marker
            coordinate={mockLocation}
            title="Point de départ"
            description="Position fictive"
            pinColor="green"
          />
        )}

        {/* Marqueur pour la destination */}
        {destination && (
          <Marker
            coordinate={destination}
            title={destinationDetails}
            description={`Distance : ${distanceText}`}
            pinColor="red"
          />
        )}

        {/* Tracé de la route */}
        {routeCoords.length > 0 && (
          <Polyline coordinates={routeCoords} strokeWidth={4} strokeColor="blue" />
        )}
      </MapView>

      {/* Instructions et durée */}
      <View style={styles.instructionBox}>
        {steps.length > 0 && (
          <View style={{ marginVertical: 5 }}>
            <Text style={{ color: '#FFF' }}>{steps[0].text}</Text>
            <Text style={{ color: '#CCC' }}>Distance : {steps[0].distance}</Text>
          </View>
        )}
      </View>
      

      {/* Panneau en bas */}
      <View style={styles.bottomPanel}>
        <Text style={styles.distanceText}>Distance : {distanceText}</Text>
        <Text style={styles.durationText}>Durée estimée : {duration}</Text>
      </View>

      {/* Boutons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.contactButton} onPress={() => navigation.navigate('Contact')}>
          <Text style={styles.contactText}>Contact</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.goBack()}>
          <Text style={styles.homeText}>Retour</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.recenterButton}
          onPress={() => {
            if (mapViewRef.current && mockLocation) {
              mapViewRef.current.animateToRegion(mockLocation, 1000);
            }
          }}
        >
          <Text style={styles.recenterText}>Recentrer</Text>
        </TouchableOpacity>
      </View>

      {/* Contrôles audio */}
      <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
        <Text style={{ color: '#FFF', marginRight: 10 }}>Audio :</Text>
        <Switch
          value={isAudioEnabled}
          onValueChange={() => {
            setIsAudioEnabled((prev) => {
              if (!prev) {
                Speech.stop(); // Arrête la lecture en cours
                setCurrentAudioStep(null); // Réinitialise l'état audio
              }
              return !prev;
            });
          }}
        />

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
    backgroundColor: 'rgba(30, 30, 74, 0.8)',
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
