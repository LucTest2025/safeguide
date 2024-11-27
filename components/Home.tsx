import { SafeAreaView, StyleSheet, Text, Button, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { addUser, getUsers } from '../firebase';

// Définir le type d'utilisateur
type User = {
  id: string;
  name: string;
  role: string;
};

const Home = () => {
  // Préciser le type de l'état users
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Récupérer les utilisateurs au chargement
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const usersData = await getUsers();
    setUsers(usersData || []); // Initialiser avec un tableau vide si usersData est null/undefined
  };

  return (
    <SafeAreaView>
      <Text>Home</Text>
      <Button title="Add User" onPress={() => addUser('Luc Aymar', 'Developer')} />
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Text>{item.name} - {item.role}</Text>
        )}
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});
