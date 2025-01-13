import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import refugeReducer from './reducers/refugeReducer'; // Importez le reducer des refuges

const store = configureStore({
  reducer: {
    auth: authReducer,
    refuges: refugeReducer, // Ajoutez le reducer des refuges
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
