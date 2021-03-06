import {
  ADD_SELECTED_RECIPE_TO_STATE,
  REMOVE_RECIPE_FROM_STATE_ON_UNSELECTED,
  FETCH_RECIPE_BEGIN,
  FETCH_RECIPE_FAILURE,
  FETCH_RECIPE_SUCCESS,
} from '../../actions/recipes';

const initialRecipeState = {
  item: null,
  loading: false,
  error: null,
};

export default function currentRecipeReducer(state = initialRecipeState, action) {
  Object.freeze(state);
  switch (action.type) {
    case ADD_SELECTED_RECIPE_TO_STATE:
      return {
        ...state,
        item: action.payload.recipe,
      };
    case REMOVE_RECIPE_FROM_STATE_ON_UNSELECTED:
      return {
        ...state,
        item: null,
      };
    case FETCH_RECIPE_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_RECIPE_SUCCESS:
      return {
        ...state,
        loading: false,
        item: action.payload.recipe,
      };
    case FETCH_RECIPE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        item: null,
      };
    default:
      return state;
  }
}
