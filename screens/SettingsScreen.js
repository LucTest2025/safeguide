import React, { useState } from "react";
import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const SettingsScreen = () => {
  const [isVisualEnabled, setIsVisualEnabled] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(true);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Bouton retour */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Alert")}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Paramètres de Notification</Text>
      </View>

      <View style={styles.setting}>
        <Text style={styles.label}>Notifications visuelles</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#7267F0" }}
          thumbColor={isVisualEnabled ? "#7267F0" : "#f4f3f4"}
          value={isVisualEnabled}
          onValueChange={(value) => setIsVisualEnabled(value)}
        />
      </View>

      <View style={styles.setting}>
        <Text style={styles.label}>Notifications sonores</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#7267F0" }}
          thumbColor={isSoundEnabled ? "#7267F0" : "#f4f3f4"}
          value={isSoundEnabled}
          onValueChange={(value) => setIsSoundEnabled(value)}
        />
      </View>

      <View style={styles.setting}>
        <Text style={styles.label}>Notifications vibratoires</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#7267F0" }}
          thumbColor={isVibrationEnabled ? "#7267F0" : "#f4f3f4"}
          value={isVibrationEnabled}
          onValueChange={(value) => setIsVibrationEnabled(value)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1E1E4A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  backButton: {
    marginRight: 5, // Espace entre le bouton et le texte
    backgroundColor: "#2C2C54",
    borderRadius: 20,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  setting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#7267F0",
    paddingBottom: 10,
  },
  label: {
    fontSize: 18,
    color: "#FFFFFF",
  },
});

export default SettingsScreen;
