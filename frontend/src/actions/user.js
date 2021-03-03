import * as apiUtil from '../util/user';
import { receiveErrors } from './error';

export const UPDATE_MEALS = 'UPDATE_MEALS';
export const ADD_RECIPE = 'ADD_RECIPE';
export const ADD_RATING = 'ADD_RATING';

const updateUserMeals = (meals) => ({
  type: UPDATE_MEALS,
  meals,
});

const addUserRecipe = (recipes) => ({
  type: ADD_RECIPE,
  recipes,
});

const addUserRating = (ratings) => ({
  type: ADD_RATING,
  ratings,
});

export const updateMeals = (meals) => async (dispatch, getState) => {
  const user = getState().session;
  user.meals = meals;

  const response = await apiUtil.updateUser(user);
  const data = await response.json();

  if (response.ok) {
    return dispatch(updateUserMeals(meals));
  }
  return dispatch(receiveErrors(data));
};

export const addRecipe = (recipes) => async (dispatch, getState) => {
  const user = getState().session;
  user.recipes = recipes;

  const response = await apiUtil.updateUser(user);
  const data = await response.json();

  if (response.ok) {
    return dispatch(addUserRecipe(recipes));
  }
  return dispatch(receiveErrors(data));
};

export const addRating = (ratings) => async (dispatch, getState) => {
  const user = getState().session;

  user.ratings = ratings;

  const response = await apiUtil.updateUser(user);
  const data = await response.json();

  if (response.ok) {
    return dispatch(addUserRating(ratings));
  }
  return dispatch(receiveErrors(data));
};
