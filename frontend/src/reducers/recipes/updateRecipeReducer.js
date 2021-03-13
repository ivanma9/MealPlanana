import {
  UPDATE_RECIPE_BEGIN,
  UPDATE_RECIPE_FAILURE,
  UPDATE_RECIPE_SUCCESS,
} from '../../actions/recipes';

const initialState = {
  loading: false,
  error: null,
};

export default function updateRecipeReducer(state = initialState, action) {
  Object.freeze(state);
  switch (action.type) {
    case UPDATE_RECIPE_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_RECIPE_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case UPDATE_RECIPE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
}
