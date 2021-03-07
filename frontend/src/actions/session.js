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
export const ADD_RATING = 'ADD_RATING';

const updateUserMeals = (meals) => ({
  type: UPDATE_MEALS,
  payload: { meals },
});

const addUserRecipe = (recipes) => ({
  type: ADD_RECIPE,
  payload: { recipes },
});

const addUserRating = (ratings) => ({
  type: ADD_RATING,
  payload: { ratings },
});

export const updateMeals = (meal) => async (dispatch, getState) => {
  const user = JSON.parse(JSON.stringify(getState().session));
  user.recipes = user.meals.concat(meal);

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

export const addRating = (rating) => async (dispatch, getState) => {
  const user = JSON.parse(JSON.stringify(getState().session));
  user.ratings = user.ratings.concat(rating);

  const response = await apiUtil.updateUser(user);
  const data = await response.json();

  if (response.ok) {
    return dispatch(addUserRating(user.ratings));
  }
  return dispatch(receiveErrors(data));
};
