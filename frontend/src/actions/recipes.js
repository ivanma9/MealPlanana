import * as apiUtil from '../util/recipes';

export const FETCH_RECIPES_BEGIN = 'FETCH_RECIPES_BEGIN';
export const FETCH_RECIPES_SUCCESS = 'FETCH_RECIPES_SUCCESS';
export const FETCH_RECIPES_FAILURE = 'FETCH_RECIPES_FAILURE';

export const fetchRecipesBegin = () => ({
  type: FETCH_RECIPES_BEGIN,
});
export const fetchRecipesSuccess = (recipes) => ({
  type: FETCH_RECIPES_SUCCESS,
  payload: { recipes },
});
export const fetchRecipesFailure = (error) => ({
  type: FETCH_RECIPES_FAILURE,
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

export const FETCH_RECIPE_BEGIN = 'FETCH_RECIPE_BEGIN';
export const FETCH_RECIPE_SUCCESS = 'FETCH_RECIPE_SUCCESS';
export const FETCH_RECIPE_FAILURE = 'FETCH_RECIPE_FAILURE';

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

export const fetchRecipe = (id) => async (dispatch) => {
  dispatch(fetchRecipeBegin());
  const response = await apiUtil.fetchRecipe(id);
  const data = await response.json();
  if (response.ok) {
    return dispatch(fetchRecipeSuccess(data));
  }
  return dispatch(fetchRecipeFailure(data));
};

export const CREATE_RECIPE_BEGIN = 'CREATE_RECIPE_BEGIN';
export const CREATE_RECIPE_SUCCESS = 'CREATE_RECIPE_SUCCESS';
export const CREATE_RECIPE_FAILURE = 'CREATE_RECIPE_FAILURE';

export const createRecipeBegin = () => ({
  type: CREATE_RECIPE_BEGIN,
});
export const createRecipeSuccess = () => ({
  type: CREATE_RECIPE_SUCCESS,
});
export const createRecipeFailure = (error) => ({
  type: CREATE_RECIPE_FAILURE,
  payload: { error },
});

export const createRecipe = (recipe) => async (dispatch) => {
  const response = await apiUtil.createRecipe(recipe);
  const data = await response.json();

  if (response.ok) {
    return dispatch(createRecipeSuccess());
  }
  return dispatch(createRecipeFailure(data));
};

export const UPDATE_RECIPE_BEGIN = 'UPDATE_RECIPE_BEGIN';
export const UPDATE_RECIPE_SUCCESS = 'UPDATE_RECIPE_SUCCESS';
export const UPDATE_RECIPE_FAILURE = 'UPDATE_RECIPE_FAILURE';

export const updateRecipeBegin = () => ({
  type: UPDATE_RECIPE_BEGIN,
});
export const updateRecipeSuccess = () => ({
  type: UPDATE_RECIPE_SUCCESS,
});
export const updateRecipeFailure = (error) => ({
  type: UPDATE_RECIPE_FAILURE,
  payload: { error },
});

export const updateRecipe = (recipe, id) => async (dispatch) => {
  const formData = new FormData();
  formData.append('title', recipe.title);
  formData.append('description', recipe.description);
  formData.append('directions', recipe.directions);
  formData.append('ratingTotal', recipe.ratingTotal);

  if (recipe.preview !== undefined) {
    formData.append('preview', recipe.preview);
  }

  if (recipe.images && recipe.images.length !== 0) {
    recipe.images.forEach((item) => formData.append('images[]', item));
  } else {
    formData.append('images[]', []);
  }

  if (recipe.ingredients.length !== 0) {
    recipe.ingredients.forEach((item) => formData.append('ingredients[]', item));
  } else {
    formData.append('ingredients[]', []);
  }

  if (recipe.tags.length !== 0) {
    recipe.tags.forEach((item) => formData.append('tags[]', item));
  } else {
    formData.append('tags[]', []);
  }

  const response = await apiUtil.updateRecipe(formData, id);
  const data = await response.json();

  if (response.ok) {
    return dispatch(updateRecipeSuccess());
  }
  return dispatch(updateRecipeFailure(data));
};

export const DELETE_RECIPE_BEGIN = 'DELETE_RECIPE_BEGIN';
export const DELETE_RECIPE_SUCCESS = 'DELETE_RECIPE_SUCCESS';
export const DELETE_RECIPE_FAILURE = 'DELETE_RECIPE_FAILURE';

export const deleteRecipeBegin = () => ({
  type: DELETE_RECIPE_BEGIN,
});
export const deleteRecipeSuccess = () => ({
  type: DELETE_RECIPE_SUCCESS,
});
export const deleteRecipeFailure = (error) => ({
  type: DELETE_RECIPE_FAILURE,
  payload: { error },
});

export const deleteRecipe = (id) => async (dispatch) => {
  dispatch(deleteRecipeBegin());
  const response = await apiUtil.deleteRecipe(id);
  console.log(response);
  const data = await response.json();
  console.log(data);
  if (response.ok) {
    return dispatch(deleteRecipeSuccess());
  }
  return dispatch(deleteRecipeFailure(data));
};
