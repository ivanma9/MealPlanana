import {
  FETCH_RECIPE_BEGIN,
  FETCH_RECIPE_FAILURE,
  FETCH_RECIPE_SUCCESS,
} from '../../actions/recipes';

const initialRecipeState = {
  item: null,
  loading: false,
  error: null,
};

export default function recipeReducer(state = initialRecipeState, action) {
  Object.freeze(state);
  switch (action.type) {
    case FETCH_RECIPE_BEGIN:
      console.log('begin');
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_RECIPE_SUCCESS:
      console.log('success');
      return {
        ...state,
        loading: false,
        item: action.payload.recipe,
      };
    case FETCH_RECIPE_FAILURE:
      console.log('failure');
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        item: null,
      };
    default:
      console.log('default');
      return state;
  }
}
