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
    // files: recipe.preview,
    headers: {
      'Content-Type': 'application/json',
    },
  })
);

export const updateRecipe = (formData, id) => (
  fetch(`/api/recipes/update/${id}`, {
    method: 'PUT',
    body: formData,
  })
);
