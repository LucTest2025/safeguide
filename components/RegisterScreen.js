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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../redux/firebaseConfig'; // Configuration Firebase
import Icon from 'react-native-vector-icons/FontAwesome'; // Pour les icônes
import ImagePicker from 'react-native-image-picker'; // Pour la sélection d'image

const { width, height } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [handicap, setHandicap] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImagePick = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        maxWidth: 500,
        maxHeight: 500,
      },
      (response) => {
        if (response.didCancel) {
          Alert.alert('Cancelled', 'You cancelled image selection.');
        } else if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Unknown error.');
        } else {
          setPhoto(response.assets[0].uri);
        }
      }
    );
  };

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password || !handicap) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      // Firebase Authentication: Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore: Save additional user data
      await setDoc(doc(firestore, 'users', user.uid), {
        firstName,
        lastName,
        email,
        handicap,
        profilePicture: photo || '',
      });

      Alert.alert('Success', 'Your account has been created!');
      navigation.navigate('Login'); // Redirect to Login screen
    } catch (error) {
      console.error('Signup error:', error.message);
      Alert.alert('Error', error.message || 'Unknown error.');
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
            source={require('../assets/logo.png')} // Replace with your logo path
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Welcome Text */}
        <Text style={styles.title}>Register</Text>
        <Text style={styles.subtitle}>Create your new account</Text>

        {/* Input Fields */}
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

        {/* Signup Button */}
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

        {/* Footer with Login Redirection */}
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
    marginBottom: height * 0.05,
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
  },
  title: {
    fontSize: height * 0.03,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: height * 0.01,
  },
  subtitle: {
    fontSize: height * 0.02,
    color: '#A1A1A1',
    marginBottom: height * 0.02,
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
  },
  imagePicker: {
    backgroundColor: '#7267F0',
    borderRadius: width * 0.03,
    alignItems: 'center',
    paddingVertical: height * 0.015,
    marginBottom: height * 0.015,
  },
  imagePickerText: {
    color: '#FFFFFF',
    fontSize: height * 0.02,
  },
  signupButton: {
    backgroundColor: '#7267F0',
    width: '100%',
    borderRadius: width * 0.03,
    alignItems: 'center',
    paddingVertical: height * 0.015,
    marginBottom: height * 0.025,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: height * 0.02,
    fontWeight: 'bold',
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
