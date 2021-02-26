export const parseError = (err) => {
  if (err.isJoi) { return err.details; }
  return JSON.stringify(err, Object.getOwnPropertyNames(err));
};

export const sessionizeUser = (user) => ({
  userId: user.id,
  username: user.username,
  email: user.email,
  meals: user.meals,
  ratings: user.ratings,
  recipes: user.recipes,
  profile: user.profile,
});
