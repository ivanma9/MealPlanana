import {
  FETCH_RECIPES_BEGIN,
  FETCH_RECIPES_FAILURE,
  FETCH_RECIPES_SUCCESS,
} from '../../actions/recipes';

const initialListState = {
  items: [],
  loading: false,
  error: null,
};

export default function recipeListReducer(state = initialListState, action) {
  Object.freeze(state);
  switch (action.type) {
    case FETCH_RECIPES_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_RECIPES_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload.recipes,
      };
    case FETCH_RECIPES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        items: [],
      };
    default:
      return state;
  }
}
