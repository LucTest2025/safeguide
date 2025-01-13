import { AUTH_USER, LOGOUT_USER, UPDATE_USER_PHOTO, UPDATE_USER_INFO } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../database/firebaseConfig';
import { FIREBASE_API_KEY } from '@env'; // Importer la clé API depuis .env
// Messages d'erreur Firebase
const firebaseErrorMessages = {
  EMAIL_EXISTS: "Cette adresse email est déjà utilisée.",
  EMAIL_NOT_FOUND: "Adresse email introuvable.",
  INVALID_PASSWORD: "Mot de passe incorrect.",
  TOO_MANY_ATTEMPTS_TRY_LATER: "Trop de tentatives, réessayez plus tard.",
  UNKNOWN_ERROR: "Une erreur inconnue est survenue.",
};

// **Action pour mettre à jour les informations utilisateur dans Redux**
export const updateUserInfo = (updatedInfo) => ({
  type: UPDATE_USER_INFO,
  payload: updatedInfo,
});

// **Action pour mettre à jour la photo de profil dans Redux**
export const updateUserPhoto = (photo) => ({
  type: UPDATE_USER_PHOTO,
  payload: photo,
});

// **Gestion des erreurs Firebase**
const handleFirebaseResponse = async (response) => {
  const responseData = await response.json();
  if (!response.ok) {
    const errorMsg = responseData.error?.message || 'UNKNOWN_ERROR';
    const customMessage =
      firebaseErrorMessages[errorMsg] || firebaseErrorMessages.UNKNOWN_ERROR;
    console.error("Erreur Firebase détectée :", errorMsg);
    throw new Error(customMessage);
  }
  return responseData;
};

// **Sauvegarder les données utilisateur dans Firestore**
const saveUserToFirestore = async (user) => {
  try {
    const userRef = doc(db, 'users', user.localId);
    await setDoc(userRef, {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      photo: user.photo || null,
      handicap: user.handicap,
      createdAt: new Date().toISOString(),
    }, { merge: true });
    console.log('Utilisateur enregistré dans Firestore avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement dans Firestore:', error);
    throw error;
  }
};

// **Récupérer les données utilisateur depuis Firestore**
const fetchUserFromFirestore = async (localId) => {
  try {
    const userRef = doc(db, 'users', localId);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      console.log('Données utilisateur récupérées depuis Firestore.');
      return userSnapshot.data();
    } else {
      console.log('Aucune donnée utilisateur trouvée dans Firestore.');
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données Firestore:', error);
    throw error;
  }
};

// **Inscription utilisateur**
export const signupUser = (userData) => {
  return async (dispatch) => {
    try {
      const { email, password, firstName, lastName, photo, handicap } = userData;

      if (!email || !password || !firstName || !lastName || !handicap) {
        throw new Error("Veuillez remplir tous les champs obligatoires.");
      }

      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );

      const responseData = await handleFirebaseResponse(response);

      const user = {
        localId: responseData.localId,
        idToken: responseData.idToken,
        email,
        firstName,
        lastName,
        photo: photo || null,
        handicap,
      };

      await saveUserToFirestore(user); // Sauvegarder dans Firestore
      dispatch(authenticateUser(user)); // Sauvegarder dans Redux
      const tokenExpiryDate = calculateExpiryDate(responseData.expiresIn);
      await saveUserToStorage(user, tokenExpiryDate); // Sauvegarder localement
      console.log("Utilisateur inscrit avec succès.");
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error.message);
      throw error;
    }
  };
};

// **Connexion utilisateur**
export const loginUser = (email, password) => {
  return async (dispatch) => {
    try {
      if (!email || !password) {
        throw new Error("Veuillez fournir un email et un mot de passe.");
      }

      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );

      const responseData = await handleFirebaseResponse(response);

      const firestoreUser = await fetchUserFromFirestore(responseData.localId);

      if (!firestoreUser) {
        throw new Error('Les informations utilisateur sont introuvables.');
      }

      const user = {
        localId: responseData.localId,
        idToken: responseData.idToken,
        email,
        firstName: firestoreUser.firstName,
        lastName: firestoreUser.lastName,
        photo: firestoreUser.photo,
        handicap: firestoreUser.handicap,
      };

      dispatch(authenticateUser(user)); // Authentifier dans Redux
      const tokenExpiryDate = calculateExpiryDate(responseData.expiresIn);
      await saveUserToStorage(user, tokenExpiryDate); // Sauvegarder localement
      console.log("Utilisateur connecté avec succès.");
    } catch (error) {
      console.error("Erreur lors de la connexion :", error.message);
      throw error;
    }
  };
};

// **Déconnexion utilisateur**
export const logoutUser = () => {
  return async (dispatch) => {
    try {
      await AsyncStorage.removeItem('userDetails');
      dispatch({ type: LOGOUT_USER });
      console.log("Déconnexion réussie. Données utilisateur supprimées.");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };
};

// **Authentifier l'utilisateur dans Redux**
const authenticateUser = (user) => ({
  type: AUTH_USER,
  payload: user,
});

// **Calculer la date d'expiration du token**
const calculateExpiryDate = (expiresIn) => {
  const expiresInMilliseconds = parseInt(expiresIn, 10) * 1000;
  return new Date(Date.now() + expiresInMilliseconds).toISOString();
};

// **Sauvegarder les détails utilisateur localement**
const saveUserToStorage = async (user, tokenExpiryDate) => {
  try {
    await AsyncStorage.setItem(
      'userDetails',
      JSON.stringify({ ...user, tokenExpiryDate })
    );
    console.log('Données utilisateur sauvegardées avec succès.');
  } catch (error) {
    console.error("Erreur lors de l'enregistrement dans AsyncStorage :", error);
  }
};
