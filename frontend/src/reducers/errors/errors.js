import {
  RECEIVE_CURRENT_USER, UPDATE_MEALS, ADD_RECIPE, REMOVE_RECIPE, UPDATE_RATINGS,
} from '../../actions/session';
import { CLEAR_ERRORS, RECEIVE_ERRORS } from '../../actions/error';

export default (state = '', { message, type }) => {
  Object.freeze(state);
  switch (type) {
    case RECEIVE_ERRORS:
      return message;
    case RECEIVE_CURRENT_USER:
      return '';
    case UPDATE_MEALS:
      return '';
    case ADD_RECIPE:
      return '';
    case REMOVE_RECIPE:
      return '';
    case UPDATE_RATINGS:
      return '';
    case CLEAR_ERRORS:
      return '';
    default:
      return state;
  }
};
