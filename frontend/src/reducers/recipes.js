// import { RECEIVE_RECIPES } from '../actions/recipes';

// const nullSession = { recipes: null };

// export default (state = nullSession, { type, recipes }) => {
//   Object.freeze(state);
//   switch (type) {
//     case RECEIVE_RECIPES:
//       return recipes;
//     default:
//       return state;
//   }
// };

import { FETCH_RECIPES_BEGIN, FETCH_RECIPES_FAILURE, FETCH_RECIPES_SUCCESS } from '../actions/recipes';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export default function recipeReducer(state = initialState, action) {
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
