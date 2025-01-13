import { FETCH_REFUGES_SUCCESS, FETCH_REFUGES_ERROR } from '../constants';

const initialState = {
  refuges: [],
  error: null,
};

const refugeReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REFUGES_SUCCESS:
      return {
        ...state,
        refuges: action.payload,
        error: null,
      };
    case FETCH_REFUGES_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default refugeReducer;
