import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../redux/database/firebaseConfig';
import { updateUserPhoto, updateUserInfo } from '../redux/actions/authActions';

const { width, height } = Dimensions.get('window');

const saveUserInfoToFirestore = async (updatedInfo, userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, updatedInfo, { merge: true });
    console.log('Informations utilisateur mises à jour dans Firestore.');
  } catch (error) {
    console.error('Erreur lors de la mise à jour des données Firestore :', error);
    throw error;
  }
};

const AccountScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const defaultUser = {
    firstName: 'Utilisateur',
    lastName: 'Anonyme',
    email: 'email@example.com',
    photo: null,
    handicap: 'Non spécifié',
  };

  useEffect(() => {
    setUpdatedInfo({
      firstName: user.firstName || defaultUser.firstName,
      lastName: user.lastName || defaultUser.lastName,
      email: user.email || defaultUser.email,
      photo: user.photo || defaultUser.photo,
      handicap: user.handicap || defaultUser.handicap,
    });
    setIsLoading(false);
  }, [user]);

  const handleImagePick = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Permission refusée',
          'Vous devez autoriser l’accès à la galerie pour sélectionner une image.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const selectedPhoto = result.assets[0].uri;
        setUpdatedInfo((prev) => ({ ...prev, photo: selectedPhoto }));
        dispatch(updateUserPhoto(selectedPhoto));
        Alert.alert('Succès', 'Votre photo de profil a été mise à jour.');
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de l’image :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection.');
    }
  };

  const handleSave = async () => {
    try {
      if (!user.userId) throw new Error('ID utilisateur manquant.');

      await saveUserInfoToFirestore(updatedInfo, user.userId);
      dispatch(updateUserInfo(updatedInfo));
      Alert.alert('Succès', 'Vos informations ont été mises à jour.');
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde :', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder les informations.');
    }
  };

  const handleCancel = () => {
    setUpdatedInfo({
      firstName: user.firstName || defaultUser.firstName,
      lastName: user.lastName || defaultUser.lastName,
      email: user.email || defaultUser.email,
      photo: user.photo || defaultUser.photo,
      handicap: user.handicap || defaultUser.handicap,
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7267F0" />
        <Text style={styles.loadingText}>Chargement des données...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Bouton Retour */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={width * 0.06} color="#FFF" />
      </TouchableOpacity>

      <View style={styles.profileHeader}>
        <Image
          source={
            updatedInfo.photo
              ? { uri: updatedInfo.photo }
              : require('../assets/default-avatar.png')
          }
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.cameraIcon} onPress={handleImagePick}>
          <Ionicons name="camera" size={width * 0.08} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileDetails}>
        <TextInput
          style={styles.input}
          editable={isEditing}
          value={updatedInfo.firstName}
          onChangeText={(text) =>
            setUpdatedInfo((prev) => ({ ...prev, firstName: text }))
          }
          placeholder="Prénom"
          placeholderTextColor="#A1A1A1"
        />
        <TextInput
          style={styles.input}
          editable={isEditing}
          value={updatedInfo.lastName}
          onChangeText={(text) =>
            setUpdatedInfo((prev) => ({ ...prev, lastName: text }))
          }
          placeholder="Nom"
          placeholderTextColor="#A1A1A1"
        />
        <TextInput
          style={styles.input}
          editable={isEditing}
          value={updatedInfo.email}
          onChangeText={(text) =>
            setUpdatedInfo((prev) => ({ ...prev, email: text }))
          }
          placeholder="E-mail"
          placeholderTextColor="#A1A1A1"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          editable={isEditing}
          value={updatedInfo.handicap}
          onChangeText={(text) =>
            setUpdatedInfo((prev) => ({ ...prev, handicap: text }))
          }
          placeholder="Handicap"
          placeholderTextColor="#A1A1A1"
        />
      </View>

      <View style={styles.buttonsContainer}>
        {isEditing ? (
          <>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Enregistrer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.buttonText}>Modifier les informations</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1E1E4A',
    padding: width * 0.05,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: height * 0.05,
    left: width * 0.05,
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E4A',
  },
  loadingText: {
    marginTop: height * 0.01,
    color: '#FFF',
    fontSize: width * 0.04,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  avatar: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: (width * 0.35) / 2,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: width * 0.25,
    backgroundColor: '#7267F0',
    borderRadius: width * 0.1,
    width: width * 0.12,
    height: width * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  profileDetails: {
    width: '100%',
    marginTop: height * 0.03,
  },
  input: {
    backgroundColor: '#2C2C54',
    color: '#FFFFFF',
    borderRadius: width * 0.03,
    padding: height * 0.02,
    marginBottom: height * 0.02,
    fontSize: width * 0.045,
  },
  buttonsContainer: {
    marginTop: height * 0.03,
    width: '100%',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#7267F0',
    borderRadius: width * 0.04,
    alignItems: 'center',
    paddingVertical: height * 0.015,
    width: '90%',
  },
  saveButton: {
    backgroundColor: '#34A853',
    borderRadius: width * 0.04,
    alignItems: 'center',
    paddingVertical: height * 0.015,
    width: '90%',
    marginBottom: height * 0.02,
  },
  cancelButton: {
    backgroundColor: '#FF5252',
    borderRadius: width * 0.04,
    alignItems: 'center',
    paddingVertical: height * 0.015,
    width: '90%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});

export default AccountScreen;
