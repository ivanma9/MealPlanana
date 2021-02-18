import { RECEIVE_CURRENT_USER, LOGOUT_CURRENT_USER } from '../../actions/session';

const nullSession = { userId: null, username: null };
export default (state = nullSession, { type, user }) => {
  Object.freeze(state);
  switch (type) {
    case RECEIVE_CURRENT_USER:
      return user;
    case LOGOUT_CURRENT_USER:
      return nullSession;
    default:
      return state;
  }
};
