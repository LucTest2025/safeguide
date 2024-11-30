import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../redux/firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Succès', 'Connexion réussie !');
      navigation.replace('MainApp'); // Navigue vers l'écran principal
    } catch (error) {
      console.error('Erreur lors de la connexion:', error.message);
      Alert.alert('Erreur', error.message || 'Erreur inconnue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.welcomeText}>Welcome back</Text>
      <Text style={styles.subText}>Login to your account</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          placeholderTextColor="#A1A1A1"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor="#A1A1A1"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.iconWrapper}
        >
          <Icon
            name={showPassword ? 'visibility' : 'visibility-off'}
            size={height * 0.03}
            color="#A1A1A1"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E4A',
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
  welcomeText: {
    fontSize: height * 0.03,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subText: {
    fontSize: height * 0.02,
    color: '#A1A1A1',
    marginBottom: height * 0.03,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#2C2C54',
    color: '#FFFFFF',
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.03,
    height: height * 0.065,
    marginBottom: height * 0.02,
  },
  loginButton: {
    backgroundColor: '#7267F0',
    width: '100%',
    borderRadius: width * 0.02,
    alignItems: 'center',
    paddingVertical: height * 0.015,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: height * 0.02,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
