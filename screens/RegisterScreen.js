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
import { signupUser } from '../redux/actions/authActions';

// Dimensions de l'écran
const { width, height } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#A1A1A1"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Type of Handicap"
            placeholderTextColor="#A1A1A1"
            value={handicap}
            onChangeText={setHandicap}
          />
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

        {/* Séparateur */}
        <View style={styles.separator}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        {/* Réseaux sociaux */}
        <View style={styles.socialContainer}>
          <TouchableOpacity>
            <FontAwesome name="google" size={height * 0.04} color="#EA4335" />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome name="facebook" size={height * 0.04} color="#4267B2" />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome name="apple" size={height * 0.04} color="#000000" />
          </TouchableOpacity>
        </View>

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
    marginBottom: height * 0.001, // Descendre le logo un peu plus bas
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
  },
  title: {
    fontSize: height * 0.03,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: height * 0.01, // Réduction de l'espace entre "Register" et le sous-titre
  },
  subtitle: {
    fontSize: height * 0.02,
    color: '#A1A1A1',
    marginBottom: height * 0.02, // Espacement réduit mais toujours équilibré
  },
  inputContainer: {
    width: '100%',
    marginBottom: height * 0.02, // Réduction de l'espace sous le container d'inputs
  },
  input: {
    backgroundColor: '#2C2C54',
    color: '#FFFFFF',
    height: height * 0.065,
    borderRadius: width * 0.03,
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.015, // Réduction de l'espace entre les champs
    fontSize: height * 0.02,
    borderWidth: 1,
    borderColor: '#A1A1A1',
  },
  imagePicker: {
    backgroundColor: '#7267F0',
    borderRadius: width * 0.03,
    alignItems: 'center',
    paddingVertical: height * 0.015,
    marginBottom: height * 0.015, // Réduction de l'espace sous le bouton de sélection d'image
  },
  imagePickerText: {
    color: '#FFFFFF',
    fontSize: height * 0.02,
  },
  terms: {
    fontSize: height * 0.015,
    color: '#A1A1A1',
    textAlign: 'center',
    marginBottom: height * 0.02, // Réduction de l'espace sous les termes et conditions
  },
  link: {
    color: '#7267F0',
  },
  signupButton: {
    backgroundColor: '#7267F0',
    width: '100%',
    borderRadius: width * 0.03,
    alignItems: 'center',
    paddingVertical: height * 0.015,
    marginBottom: height * 0.025, // Réduction de l'espace sous le bouton "Sign Up"
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: height * 0.02,
    fontWeight: 'bold',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02, // Réduction de l'espace sous le séparateur
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#A1A1A1',
  },
  orText: {
    color: '#A1A1A1',
    marginHorizontal: width * 0.02,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginBottom: height * 0.02, // Réduction de l'espace sous les icônes des réseaux sociaux
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: '#A1A1A1',
  },
  loginText: {
    color: '#7267F0',
    fontWeight: 'bold',
  },
});


export default RegisterScreen;
