import { AUTH_USER, LOGOUT_USER, UPDATE_USER_PHOTO, UPDATE_USER_INFO } from '../constants';

const initialState = {
  token: null,
  userId: null,
  email: null,
  firstName: null,
  lastName: null,
  photo: null,
  handicap: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_USER:
      return {
        ...state,
        token: action.payload?.idToken || state.token,
        userId: action.payload?.localId || state.userId,
        email: action.payload?.email || state.email,
        firstName: action.payload?.firstName || state.firstName,
        lastName: action.payload?.lastName || state.lastName,
        photo: action.payload?.photo || state.photo,
        handicap: action.payload?.handicap || state.handicap,
      };

    case UPDATE_USER_PHOTO:
      return {
        ...state,
        photo: action.payload, // Met à jour uniquement la photo
      };

    case UPDATE_USER_INFO:
      return {
        ...state,
        ...action.payload, // Met à jour les informations utilisateur avec ce qui est dans payload
      };

    case LOGOUT_USER:
      return initialState; // Réinitialise l’état à sa valeur initiale

    default:
      return state;
  }
};

export default authReducer;
