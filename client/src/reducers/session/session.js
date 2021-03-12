import {
  RECEIVE_CURRENT_USER, LOGOUT_CURRENT_USER,
} from '../../actions/session';

const nullSession = { userId: null, username: null };
export default (state = nullSession, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return action.payload.user;

    case LOGOUT_CURRENT_USER:
      return nullSession;

    default:
      return state;
  }
};
