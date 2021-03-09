import * as apiUtil from '../util/session';

import { receiveErrors } from './error';

export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';
export const LOGOUT_CURRENT_USER = 'LOGOUT_CURRENT_USER';

const receiveCurrentUser = (user) => ({
  type: RECEIVE_CURRENT_USER,
  payload: { user },
});

const logoutCurrentUser = () => ({
  type: LOGOUT_CURRENT_USER,
});

export const login = (user) => async (dispatch) => {
  const response = await apiUtil.login(user);
  const data = await response.json();

  if (response.ok) {
    return dispatch(receiveCurrentUser(data));
  }
  return dispatch(receiveErrors(data));
};

export const signup = (user) => async (dispatch) => {
  const response = await apiUtil.signup(user);
  const data = await response.json();

  if (response.ok) {
    return dispatch(receiveCurrentUser(data));
  }
  return dispatch(receiveErrors(data));
};

export const logout = () => async (dispatch) => {
  const response = await apiUtil.logout();
  const data = await response.json();
  if (response.ok) {
    return dispatch(logoutCurrentUser());
  }
  return dispatch(receiveErrors(data));
};

export const UPDATE_MEALS = 'UPDATE_MEALS';
export const ADD_RECIPE = 'ADD_RECIPE';
export const REMOVE_RECIPE = 'REMOVE_RECIPE';
export const UPDATE_RATINGS = 'UPDATE_RATINGS';

const updateUserMeals = (meals) => ({
  type: UPDATE_MEALS,
  payload: { meals },
});

const addUserRecipe = (recipes) => ({
  type: ADD_RECIPE,
  payload: { recipes },
});

const removeUserRecipe = (recipes) => ({
  type: REMOVE_RECIPE,
  payload: { recipes },
});

const updateUserRatings = (ratings) => ({
  type: UPDATE_RATINGS,
  payload: { ratings },
});

export const updateMeals = (meals) => async (dispatch, getState) => {
  const user = JSON.parse(JSON.stringify(getState().session));
  user.meals = meals;

  const response = await apiUtil.updateUser(user);
  const data = await response.json();

  if (response.ok) {
    return dispatch(updateUserMeals(user.meals));
  }
  return dispatch(receiveErrors(data));
};

export const addRecipe = (recipeID) => async (dispatch, getState) => {
  const user = JSON.parse(JSON.stringify(getState().session));
  user.recipes = user.recipes.concat(recipeID);

  const response = await apiUtil.updateUser(user);
  const data = await response.json();

  if (response.ok) {
    return dispatch(addUserRecipe(user.recipes));
  }
  return dispatch(receiveErrors(data));
};

export const removeRecipe = (recipeID) => async (dispatch, getState) => {
  const user = JSON.parse(JSON.stringify(getState().session));

  const index = user.recipes.indexOf(recipeID);
  user.recipes.splice(index, 1);

  const response = await apiUtil.updateUser(user);
  const data = await response.json();

  if (response.ok) {
    return dispatch(removeUserRecipe(user.recipes));
  }
  return dispatch(receiveErrors(data));
};

export const updateRatings = (ratings) => async (dispatch, getState) => {
  const user = JSON.parse(JSON.stringify(getState().session));
  user.ratings = ratings;

  const response = await apiUtil.updateUser(user);
  const data = await response.json();

  if (response.ok) {
    return dispatch(updateUserRatings(user.ratings));
  }
  return dispatch(receiveErrors(data));
};

export const updateRating = (rating) => async (dispatch, getState) => {
  const user = JSON.parse(JSON.stringify(getState().session));

  if (user.ratings.some((currentRating) => currentRating.recipe === rating.recipe)) {
    user.ratings
      .find((currentRating) => currentRating.recipe === rating.recipe).rating = rating.rating;
  } else {
    user.ratings.push(rating);
  }

  dispatch(updateRatings(user.ratings));
};
