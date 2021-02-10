const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const recipeRoutes = express.Router();
const PORT = 4000;

const Recipe = require('./recipe.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/recipes', {
  useNewUrlParser: true,
});
const { connection } = mongoose;

connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

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

app.use('/recipes', recipeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
