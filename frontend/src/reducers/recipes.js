import { FETCH_RECIPES_BEGIN, FETCH_RECIPES_FAILURE, FETCH_RECIPES_SUCCESS } from '../actions/recipes';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export default (state = initialState, { type, recipes, error }) => {
  Object.freeze(state);
  switch (type) {
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
        items: recipes,
      };
    case FETCH_RECIPES_FAILURE:
      return {
        ...state,
        loading: false,
        error,
        items: [],
      };
    default:
      return state;
  }
};
