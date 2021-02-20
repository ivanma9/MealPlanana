import * as apiUtil from '../util/recipes';

export const FETCH_RECIPES_BEGIN = 'FETCH_RECIPES_BEGIN';
export const FETCH_RECIPES_SUCCESS = 'FETCH_RECIPES_SUCCESS';
export const FETCH_RECIPES_FAILURE = 'FETCH_RECIPES_FAILURE';

export const FETCH_RECIPE_BEGIN = 'FETCH_RECIPE_BEGIN';
export const FETCH_RECIPE_SUCCESS = 'FETCH_RECIPE_SUCCESS';
export const FETCH_RECIPE_FAILURE = 'FETCH_RECIPE_FAILURE';

export const fetchRecipesBegin = () => ({
  type: FETCH_RECIPES_BEGIN,
});
export const fetchRecipesSuccess = (recipes) => ({
  type: FETCH_RECIPES_SUCCESS,
  payload: { recipes },
  // recipes,
});
export const fetchRecipesFailure = (error) => ({
  type: FETCH_RECIPES_FAILURE,
  payload: { error },
  // error,
});

export const fetchRecipeBegin = () => ({
  type: FETCH_RECIPE_BEGIN,
});
export const fetchRecipeSuccess = (recipe) => ({
  type: FETCH_RECIPE_SUCCESS,
  payload: { recipe },
});
export const fetchRecipeFailure = (error) => ({
  type: FETCH_RECIPE_FAILURE,
  payload: { error },
});

export const fetchRecipes = () => async (dispatch) => {
  dispatch(fetchRecipesBegin());
  const response = await apiUtil.fetchRecipes();
  const data = await response.json();
  if (response.ok) {
    return dispatch(fetchRecipesSuccess(data));
  }
  return dispatch(fetchRecipesFailure(data));
};

export const fetchRecipe = (id) => async (dispatch) => {
  dispatch(fetchRecipeBegin());
  const response = await apiUtil.fetchRecipe(id);
  const data = await response.json();
  if (response.ok) {
    return dispatch(fetchRecipeSuccess(data));
  }
  return dispatch(fetchRecipeFailure(data));
};
