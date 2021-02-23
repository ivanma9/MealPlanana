export const fetchRecipes = () => (
  fetch('/api/recipes')
);

export const fetchRecipe = (id) => (
  fetch(`/api/recipes/${id}`)
);

export const createRecipe = (recipe) => (
  fetch('/api/recipes/add', {
    method: 'POST',
    body: JSON.stringify(recipe),
    headers: {
      'Content-Type': 'application/json',
    },
  })
);
