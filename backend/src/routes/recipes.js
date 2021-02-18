const express = require('express');
const Recipe = require('../models/recipe.js');

const recipeRoutes = express.Router();

// userRoutes.post('', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     await signUp.validateAsync({ username, email, password }, { abortEarly: false });

//     const newUser = new User({ username, email, password });
//     const sessionUser = sessionizeUser(newUser);
//     await newUser.save();

//     req.session.user = sessionUser;
//     res.send(sessionUser);
//   } catch (err) {
//     res.status(400).send(parseError(err));
//   }
// });

recipeRoutes.route('/').get((req, res) => {
  Recipe.find((err, recipes) => {
    if (err) {
      console.log(err);
    } else {
      res.json(recipes);
    }
  });
});

recipeRoutes.route('/:id').get((req, res) => {
  const { id } = req.params;
  Recipe.findById(id, (err, recipe) => {
    res.json(recipe);
  });
});

recipeRoutes.route('/add').post((req, res) => {
  const recipe = new Recipe(req.body);
  recipe
    .save()
    .then((recipe) => {
      res.status(200).json({ recipe: 'recipe added successfully' });
    })
    .catch((err) => {
      res.status(400).send('adding new recipe failed');
    });
});

recipeRoutes.route('/update/:id').post((req, res) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    if (!recipe) res.status(404).send('data is not found');
    else {
      recipe.recipe_description = req.body.recipe_description;
      recipe.recipe_responsible = req.body.recipe_responsible;
      recipe.recipe_priority = req.body.recipe_priority;
      recipe.recipe_completed = req.body.recipe_completed;

      recipe
        .save()
        .then((recipe) => {
          res.json('Recipe updated!');
        })
        .catch((err) => {
          res.status(400).send('Update not possible');
        });
    }
  });
});

module.exports = recipeRoutes;
