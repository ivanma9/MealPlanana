import {
  CREATE_RECIPE_BEGIN,
  CREATE_RECIPE_FAILURE,
  CREATE_RECIPE_SUCCESS,
} from '../../actions/recipes';

const initialRecipeState = {
  loading: false,
  error: null,
};

export default function createRecipeReducer(state = initialRecipeState, action) {
  Object.freeze(state);
  switch (action.type) {
    case CREATE_RECIPE_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_RECIPE_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case CREATE_RECIPE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
}
