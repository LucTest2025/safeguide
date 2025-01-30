import { 
  FETCH_REFUGES_REQUEST, 
  FETCH_REFUGES_SUCCESS, 
  FETCH_REFUGES_ERROR,
  FETCH_REFUGE_PHOTOS_SUCCESS,
} from "../constants";

const initialState = {
  refuges: [],
  loading: false,
  error: null,
  photos: {}, // Stocker les photos des refuges par `place_id`
  lastUpdated: null,
};

const refugeReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REFUGES_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_REFUGES_SUCCESS:
      return { 
        ...state, 
        refuges: action.payload, 
        loading: false, 
        error: null, 
        lastUpdated: new Date().toISOString(),
      };

    case FETCH_REFUGE_PHOTOS_SUCCESS:
      return {
        ...state,
        photos: { ...state.photos, ...action.payload }, // Fusionne les nouvelles photos avec l'état existant
      };

    case FETCH_REFUGES_ERROR:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default refugeReducer;
