export const updateUser = (user) => (
  fetch('api/users/update', {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json',
    },
  })
);
