import * as apiUtil from '../util/recipes';

export const FETCH_RECIPES_BEGIN = 'FETCH_RECIPES_BEGIN';
export const FETCH_RECIPES_SUCCESS = 'FETCH_RECIPES_SUCCESS';
export const FETCH_RECIPES_FAILURE = 'FETCH_RECIPES_FAILURE';

export const fetchRecipesBegin = () => ({
  type: FETCH_RECIPES_BEGIN,
});

export const fetchRecipesSuccess = (recipes) => ({
  type: FETCH_RECIPES_SUCCESS,
  recipes,
});

export const fetchRecipesFailure = (error) => ({
  type: FETCH_RECIPES_FAILURE,
  error,
});

export const fetchRecipes = () => async (dispatch) => {
  dispatch(fetchRecipesBegin()); // unneeded?
  const response = await apiUtil.fetchRecipes();
  const data = await response.json();
  if (response.ok) {
    return dispatch(fetchRecipesSuccess(data));
  }
  return dispatch(fetchRecipesFailure(data));
};
