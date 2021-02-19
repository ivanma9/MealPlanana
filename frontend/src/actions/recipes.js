// import * as apiUtil from '../util/recipes';

// export const RECEIVE_RECIPES = 'RECEIVE_RECIPES';

// const receiveRecipes = (recipes) => ({
//   type: RECEIVE_RECIPES,
//   recipes,
// });

// export const getRecipes = () => async (dispatch) => {
//   const response = await apiUtil.getRecipes();
//   const data = await response.json();

//   console.log('recipes actions');
//   console.log(response);
//   console.log(data);

//   if (response.ok) {
//     return dispatch(receiveRecipes());
//   }
//   return dispatch(receiveRecipes());
// };

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

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export default function fetchRecipes() {
  return (dispatch) => {
    dispatch(fetchRecipesBegin());
    return fetch('api/recipes')
      .then(handleErrors)
      .then((res) => res.json())
      .then((json) => {
        dispatch(fetchRecipesSuccess(json));
        return json;
      })
      .catch((error) => dispatch(fetchRecipesFailure(error)));
  };
}
