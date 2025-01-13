import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker'; // Picker compatible avec Expo
import { signupUser } from '../redux/actions/authActions';

// Dimensions de l'écran
const { width, height } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // État pour gérer la visibilité du mot de passe
  const [handicap, setHandicap] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de l’image :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection.');
    }
  };

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password || !handicap) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setLoading(true);
    try {
      const userData = { firstName, lastName, email, password, handicap, photo };
      await dispatch(signupUser(userData)); // Inscription avec enregistrement Firestore
      Alert.alert('Succès', 'Compte créé avec succès !');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Texte de bienvenue */}
        <Text style={styles.title}>Register</Text>
        <Text style={styles.subtitle}>Create your new account</Text>

        {/* Champs de saisie */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#A1A1A1"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#A1A1A1"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#A1A1A1"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {/* Champ mot de passe avec icône œil */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Password"
              placeholderTextColor="#A1A1A1"
              secureTextEntry={!showPassword} // Afficher ou masquer le mot de passe
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <FontAwesome
                name={showPassword ? 'eye' : 'eye-slash'}
                size={20}
                color="#A1A1A1"
              />
            </TouchableOpacity>
          </View>
          {/* Menu déroulant pour le type de handicap */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={handicap}
              onValueChange={(itemValue) => setHandicap(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Handicap Type" value="" />
              <Picker.Item label="PMR" value="PMR" />
            </Picker>
          </View>
          <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
            <Text style={styles.imagePickerText}>
              {photo ? 'Photo Selected' : 'Choose a Profile Picture (Optional)'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Termes et conditions */}
        <Text style={styles.terms}>
          By signing up you agree to our{' '}
          <Text style={styles.link}>Terms & Conditions</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>

        {/* Bouton d'inscription */}
        <TouchableOpacity
          style={styles.signupButton}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.signupButtonText}>Sign up</Text>
          )}
        </TouchableOpacity>

        {/* Bas de page */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an Account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E4A',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  logoContainer: {
    marginBottom: height * 0.001, // Augmenté pour descendre le logo
    alignItems: 'center',
  },
  logo: {
    width: width * 0.35,
    height: width * 0.35,
  },
  title: {
    fontSize: height * 0.035,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: height * 0.01,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: height * 0.02,
    color: '#A1A1A1',
    marginBottom: height * 0.03,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: height * 0.02,
  },
  input: {
    backgroundColor: '#2C2C54',
    color: '#FFFFFF',
    height: height * 0.065,
    borderRadius: width * 0.03,
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.015,
    fontSize: height * 0.02,
    borderWidth: 1,
    borderColor: '#A1A1A1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 40, // Espace pour l'icône d'œil
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  pickerContainer: {
    backgroundColor: '#2C2C54',
    borderRadius: width * 0.03,
    marginBottom: height * 0.015,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#A1A1A1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  picker: {
    color: '#FFFFFF',
    fontSize: height * 0.02,
  },
  imagePicker: {
    backgroundColor: '#7267F0',
    borderRadius: width * 0.03,
    alignItems: 'center',
    paddingVertical: height * 0.015,
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  imagePickerText: {
    color: '#FFFFFF',
    fontSize: height * 0.02,
    fontWeight: '500',
  },
  terms: {
    fontSize: height * 0.015,
    color: '#A1A1A1',
    textAlign: 'center',
    marginBottom: height * 0.03,
  },
  link: {
    color: '#7267F0',
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: '#7267F0',
    width: '100%',
    borderRadius: width * 0.03,
    alignItems: 'center',
    paddingVertical: height * 0.018,
    marginBottom: height * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: height * 0.02,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.03,
  },
  footerText: {
    color: '#A1A1A1',
    fontSize: height * 0.018,
  },
  loginText: {
    color: '#7267F0',
    fontWeight: 'bold',
    fontSize: height * 0.018,
  },
});

export default RegisterScreen;
