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
  // recipes,
});
export const fetchRecipesFailure = (error) => ({
  type: FETCH_RECIPES_FAILURE,
  payload: { error },
  // error,
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

// export const updateRecipe = (recipe, id) => async (dispatch) => {
//   // const formData = new FormData();
//   // formData.append('body', JSON.stringify(recipe));
//   // formData.append('preview', recipe.preview);
//   // for (const item in recipe) {
//   //   formData.append(item, recipe[item]);
//   // }

//   // const response = await apiUtil.updateRecipe(formData, id);
//   const response = await apiUtil.updateRecipe(recipe, id);
//   const data = await response.json();

//   if (response.ok) {
//     return dispatch(updateRecipeSuccess());
//   }
//   return dispatch(updateRecipeFailure(data));
// };

export const updateRecipe = (recipe, id) => async (dispatch) => {
  const formData = new FormData();
  formData.append('title', recipe.title);
  formData.append('description', recipe.description);
  formData.append('directions', recipe.directions);
  formData.append('ratingTotal', recipe.ratingTotal);

  if (recipe.preview !== undefined) {
    formData.append('preview', recipe.preview);
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

  // formData.append('ingredients', recipe.ingredients);
  // if (recipe.ingredients !== undefined) { recipe.ingredients.forEach((item) => formData.append('ingredients[]', item)); } else formData.append('ingredients[]', []);
  // if (recipe.ingredients.length === 0) { formData.append('ingredients[]', []); }
  // recipe.ingredients.forEach((item) => formData.append('ingredients[]', item));
  // formData.append('tags', recipe.tags);
  // if (recipe.tags !== undefined) { recipe.tags.forEach((item) => formData.append('tags[]', item)); }
  // if (previewChanged) { formData.append('preview', recipe.preview); }
  // formData.append('images', recipe.images);

  const response = await apiUtil.updateRecipe(formData, id);
  const data = await response.json();

  if (response.ok) {
    return dispatch(updateRecipeSuccess());
  }
  return dispatch(updateRecipeFailure(data));
};

/*
Working image code example
export const updateRecipe = (recipe, id) => async (dispatch) => {
  const formData = new FormData();
  formData.append('preview', recipe.preview);

  const response = await apiUtil.updateRecipe(formData, id);
  const data = await response.json();

  if (response.ok) {
    return dispatch(updateRecipeSuccess());
  }
  return dispatch(updateRecipeFailure(data));
};
*/
