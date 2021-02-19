// export const getRecipes = () => (
//   // fetch('api/recipes', {
//   //   method: 'GET',
//   //   body: JSON.stringify(),
//   //   headers: {
//   //     'Content-Type': 'application/json',
//   //   },
//   // })
//   fetch('api/recipes').then((res) => console.log(res))
// );

export const getRecipes = async (preloadedState) => {
  const response = await fetch('/api/recipes').catch((error) => console.log(error));
  const { recipes } = await response.json();
  console.log(response);
  let initialState = preloadedState;
  if (recipes) {
    initialState = {
      recipes,
    };
  }
  return initialState;
};
