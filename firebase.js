import firestore from '@react-native-firebase/firestore';

// Fonction pour ajouter un utilisateur
export const addUser = async (name, role) => {
  try {
    await firestore()
      .collection('Users')
      .add({
        name: name,
        role: role,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    console.log('User added successfully!');
  } catch (error) {
    console.error('Error adding user: ', error);
  }
};

// Fonction pour récupérer les utilisateurs
export const getUsers = async () => {
  try {
    const usersSnapshot = await firestore().collection('Users').get();
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Users fetched successfully:', users);
    return users;
  } catch (error) {
    console.error('Error fetching users: ', error);
  }
};
