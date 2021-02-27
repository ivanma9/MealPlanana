import { combineReducers } from 'redux';
import errors from './errors/errors';
import recipe from './recipes/recipeReducer';
import recipeList from './recipes/recipeListReducer';
import session from './session/session';
import createRecipe from './recipes/createRecipeReducer';
import updateRecipe from './recipes/updateRecipeReducer';

export default combineReducers({
  session,
  errors,
  recipeList,
  recipe,
  createRecipe,
  updateRecipe,
});
