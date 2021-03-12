import {
  UPDATE_RATING_SUCCESS, UPDATE_RATING_FAILURE,
} from '../../actions/recipes';

const initialRecipeState = {
  error: null,
};

export default function ratingsReducer(state = initialRecipeState, action) {
  Object.freeze(state);
  switch (action.type) {
    case UPDATE_RATING_SUCCESS:
      return {
        ...state,
        error: null,
      };
    case UPDATE_RATING_FAILURE:
      return {
        ...state,
        error: action.payload.error,
      };
    default:
      return state;
  }
}
