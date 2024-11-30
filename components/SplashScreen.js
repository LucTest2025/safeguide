import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const handleExploreNow = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')} 
        style={styles.logo}
      />
      <Text style={styles.title}>Safe Guide</Text>
      <TouchableOpacity style={styles.button} onPress={handleExploreNow}>
        <Text style={styles.buttonText}>Explore Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E4A',
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: width * 0.08,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: height * 0.03,
  },
  button: {
    backgroundColor: '#7267F0',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.15,
    borderRadius: width * 0.02,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
