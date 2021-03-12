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

export const checkRes = (res, recipeObj, returnObj, message = 'Success!', errMessage = 'No results!') => {
  // if there was an object made/found
  if (recipeObj) {
    // if we want to return this object
    if (returnObj) {
      console.log(message);
      return res.status(200).json(recipeObj);
    }
    console.log(message);
    return res.status(200).json({ message });
  }
  // if there was an error or nothing found
  if (returnObj) {
    console.log(errMessage);
    return res.status(404).json({ message: errMessage });
  }
};
