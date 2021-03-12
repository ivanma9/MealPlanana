export const fetchRecipes = () => (
  fetch('/api/recipes')
);

export const fetchRecipe = (id) => (
  fetch(`/api/recipes/${id}`)
);

export const createRecipe = (formData) => (
  fetch('/api/recipes/add', {
    method: 'POST',
    body: formData,
  })
);

export const updateRecipe = (formData, id) => (
  fetch(`/api/recipes/update/${id}`, {
    method: 'PUT',
    body: formData,
  })
);

export const deleteRecipe = (id) => (
  fetch(`/api/recipes/delete/${id}`, { method: 'DELETE' })
);

export const updateRating = (recipeRatingData, id) => (
  fetch(`/api/recipes/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(recipeRatingData),
    headers: {
      'Content-Type': 'application/json',
    },
  })
);
