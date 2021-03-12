import {
  RECEIVE_CURRENT_USER, LOGOUT_CURRENT_USER,
  UPDATE_MEALS, ADD_RECIPE, REMOVE_RECIPE, UPDATE_RATINGS,
} from '../../actions/session';

const nullSession = { userId: null, username: null };
export default (state = nullSession, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return action.payload.user;

    case LOGOUT_CURRENT_USER:
      return nullSession;

    case UPDATE_MEALS:
      return {
        ...state,
        meals: action.payload.meals,
      };

    case ADD_RECIPE:
      return {
        ...state,
        recipes: action.payload.recipes,
      };

    case REMOVE_RECIPE:
      return {
        ...state,
        recipes: action.payload.recipes,
      };

    case UPDATE_RATINGS:
      return {
        ...state,
        ratings: action.payload.ratings,
      };

    default:
      return state;
  }
};
