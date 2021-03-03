import { UPDATE_MEALS, ADD_RECIPE, ADD_RATING } from '../../actions/user';

const nullSession = { userId: null, username: null };

export default (state = nullSession, { type, data }) => {
  Object.freeze(state);
  switch (type) {
    case UPDATE_MEALS:
      return {
        ...state,
        session: {
          ...state.session,
          meals: data,
        },
      };
    case ADD_RECIPE:
      return {
        ...state,
        session: {
          ...state.session,
          recipes: data,
        },
      };
    case ADD_RATING:
      return {
        ...state,
        session: {
          ...state.session,
          ratings: data,
        },
      };
    default:
      return state;
  }
};
