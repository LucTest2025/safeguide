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
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/actions/authActions';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    try {
      await dispatch(loginUser(email, password));
      Alert.alert('Succès', 'Connexion réussie !');
      navigation.replace('MainApp');
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
          source={require('../assets/logo.png')}
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
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={height * 0.03}
              color="#A1A1A1"
            />
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
  },
  welcomeText: {
    fontSize: height * 0.04,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: height * 0.005,
  },
  subText: {
    fontSize: height * 0.02,
    color: '#A1A1A1',
    marginBottom: height * 0.03,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: height * 0.02,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C54',
    borderWidth: 1,
    borderColor: '#A1A1A1',
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  input: {
    flex: 1,
    height: height * 0.065,
    color: '#FFFFFF',
    fontSize: height * 0.018,
  },
  iconWrapper: {
    padding: width * 0.02,
  },
  loginButton: {
    backgroundColor: '#7267F0',
    width: '100%',
    borderRadius: width * 0.03,
    alignItems: 'center',
    paddingVertical: height * 0.018,
    marginBottom: height * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: height * 0.022,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.025,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#A1A1A1',
  },
  orText: {
    color: '#A1A1A1',
    marginHorizontal: width * 0.03,
    fontSize: height * 0.018,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: height * 0.03,
  },
  footerText: {
    color: '#A1A1A1',
    fontSize: height * 0.018,
  },
  createAccountText: {
    color: '#7267F0',
    fontWeight: 'bold',
    fontSize: height * 0.018,
  },
});


export default LoginScreen;
