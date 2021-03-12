import {
  DELETE_RECIPE_BEGIN,
  DELETE_RECIPE_FAILURE,
  DELETE_RECIPE_SUCCESS,
} from '../../actions/recipes';

const initialRecipeState = {
  loading: false,
  error: null,
};

export default function recipeReducer(state = initialRecipeState, action) {
  Object.freeze(state);
  switch (action.type) {
    case DELETE_RECIPE_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_RECIPE_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case DELETE_RECIPE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
}
