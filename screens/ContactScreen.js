import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Dimensions,
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons'; // Ajout de Ionicons pour le bouton retour

const { width, height } = Dimensions.get('window'); // Obtenir les dimensions de l'écran

const refuges = [
  { name: 'Refuge Central', phone: '+1-800-123-001' },
  { name: 'Refuge Estuaire', phone: '+1-800-123-002' },
  { name: 'Refuge Montagne', phone: '+1-800-123-003' },
  { name: 'Refuge Côtier', phone: '+1-800-123-004' },
];

const ContactScreen = ({ navigation }) => {
  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`).catch((err) =>
      console.error("Erreur lors de l'appel :", err)
    );
  };

  return (
    <View style={styles.container}>
      {/* Bouton retour */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={width * 0.07} color="#FFF" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Refuges et Contacts</Text>
        {refuges.map((refuge, index) => (
          <View key={index} style={styles.refugeContainer}>
            <View style={styles.refugeInfo}>
              <Text style={styles.refugeName}>{refuge.name}</Text>
              <Text style={styles.refugePhone}>{refuge.phone}</Text>
            </View>
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => handleCall(refuge.phone)}
            >
              <FontAwesome name="phone" size={width * 0.05} color="#FFF" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E4A',
  },
  backButton: {
    position: 'absolute',
    top: height * 0.05,
    left: width * 0.05,
    zIndex: 10,
    backgroundColor: '#2C2C54',
    padding: width * 0.03,
    borderRadius: width * 0.04,
    elevation: 3,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.12, // Ajustement pour laisser de la place au bouton retour
    alignItems: 'center',
  },
  title: {
    fontSize: width * 0.06,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: height * 0.03,
    textAlign: 'center',
  },
  refugeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2C2C54',
    padding: height * 0.02,
    marginBottom: height * 0.02,
    borderRadius: width * 0.03,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  refugeInfo: {
    flex: 1,
  },
  refugeName: {
    fontSize: width * 0.045,
    color: '#FFF',
    fontWeight: 'bold',
  },
  refugePhone: {
    fontSize: width * 0.04,
    color: '#A1A1A1',
  },
  callButton: {
    backgroundColor: '#7267F0',
    padding: width * 0.03,
    borderRadius: width * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: width * 0.03,
  },
});

export default ContactScreen;
