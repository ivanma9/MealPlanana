import {
  CREATE_RECIPE_BEGIN,
  CREATE_RECIPE_FAILURE,
  CREATE_RECIPE_SUCCESS,
} from '../../actions/recipes';

const initialRecipeState = {
  error: null,
};

export default function createRecipeReducer(state = initialRecipeState, action) {
  Object.freeze(state);
  switch (action.type) {
    case CREATE_RECIPE_SUCCESS:
      return {
        ...state,
      };
    case CREATE_RECIPE_FAILURE:
      return {
        ...state,
        error: action.payload.error,
      };
    default:
      return state;
  }
}
