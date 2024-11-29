import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer'; // Assurez-vous que c'est le bon chemin
import thunk from 'redux-thunk';

const store = configureStore({
  reducer: {
    auth: authReducer, // Le "reducer" pour l'authentification utilisateur
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Désactiver les vérifications de sérialisation si nécessaire
      thunk, // Ajout explicite de redux-thunk pour les actions asynchrones
    }),
});

export default store;
