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
import Icon from 'react-native-vector-icons/MaterialIcons'; // Pour les icônes
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Pour les icônes des réseaux sociaux

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
      navigation.replace('Home');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error.message);
      Alert.alert('Erreur', error.message || 'Erreur inconnue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo.png')} // Remplacez le chemin par celui de votre logo
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Texte de bienvenue */}
      <Text style={styles.welcomeText}>Welcome back</Text>
      <Text style={styles.subText}>Login to your account</Text>

      {/* Champs de saisie */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter email"
            placeholderTextColor="#A1A1A1"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputWrapper}>
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
      </View>

      {/* Options supplémentaires */}
      <View style={styles.optionsContainer}>
        <View style={styles.rememberMe}>
          <Icon name="radio-button-unchecked" size={height * 0.02} color="#7267F0" />
          <Text style={styles.optionText}>Remember me</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Bouton de connexion */}
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

      {/* Séparateur */}
      <View style={styles.separator}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      {/* Icônes réseaux sociaux */}
      <View style={styles.socialContainer}>
        <TouchableOpacity>
          <FontAwesome name="google" size={height * 0.05} color="#EA4335" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="facebook" size={height * 0.05} color="#4267B2" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="apple" size={height * 0.05} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Créer un compte */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don’t have an Account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.createAccountText}>Create Account</Text>
        </TouchableOpacity>
      </View>
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A1A1A1',
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.03,
    marginBottom: height * 0.02,
    backgroundColor: '#2C2C54',
  },
  input: {
    flex: 1,
    height: height * 0.065,
    color: '#FFFFFF',
    fontSize: height * 0.02,
  },
  iconWrapper: {
    padding: width * 0.02,
  },
  optionsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    color: '#FFFFFF',
    marginLeft: width * 0.02,
  },
  forgotPassword: {
    color: '#7267F0',
  },
  loginButton: {
    backgroundColor: '#7267F0',
    width: '100%',
    borderRadius: width * 0.02,
    alignItems: 'center',
    paddingVertical: height * 0.015,
    marginBottom: height * 0.03,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: height * 0.02,
    fontWeight: 'bold',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.02,
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
    marginBottom: height * 0.03,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: height * 0.02,
  },
  footerText: {
    color: '#A1A1A1',
  },
  createAccountText: {
    color: '#7267F0',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
