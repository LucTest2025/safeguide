import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const saveUserToFirestore = async (user) => {
  try {
    const userRef = doc(db, 'users', user.localId); // 'users' est la collection, et 'localId' est l'UID de l'utilisateur.
    await setDoc(userRef, {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      photo: user.photo || null,
      handicap: user.handicap,
      createdAt: new Date().toISOString(),
    });

    console.log('Utilisateur enregistré dans Firestore avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement dans Firestore:', error);
    throw error;
  }
};
