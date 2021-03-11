import { combineReducers } from 'redux';
import { loadingBarReducer } from 'react-redux-loading-bar';
import errors from './errors/errors';
import currentRecipe from './recipes/currentRecipeReducer';
import recipes from './recipes/recipesReducer';
import session from './session/session';
import createRecipe from './recipes/createRecipeReducer';
import updateRecipe from './recipes/updateRecipeReducer';
import ratings from './recipes/ratingsReducer';

export default combineReducers({
  session,
  errors,
  recipes,
  currentRecipe,
  createRecipe,
  updateRecipe,
  ratings,
  loadingBar: loadingBarReducer,
});
