const express = require('express');
const Recipe = require('../models/recipe.js');

const recipeRoutes = express.Router();

recipeRoutes.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
    console.log("Successfully retrieved recipes!");
  }
  catch (err) {
    res.status(500).json({message: err});
  }
});

recipeRoutes.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const recipes = await Recipe.findById(id);
    if (recipes) {
      res.status(200).json(recipes);
      console.log(`Successfully retrieved recipe ${id}!`);
    }
    else {
      res.status(404).json({ message: "No valid entry found!" });
    }
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
});

recipeRoutes.post('/add', async (req, res) => {
  const newRecipe = new Recipe(req.body);
  try {
    await newRecipe.save();
    res.status(201).json({ message: "Recipe POST request successful!" })
    console.log("Successfully added recipe!");
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
});

// https://stackoverflow.com/questions/22071434/mongodb-update-collection-field-if-new-value-is-not-null
recipeRoutes.patch('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRecipe = await Recipe.updateOne( 
      { _id: id },
      {
        // $set: { title: req.body.title }
        $set: req.body 
      }
    );
    res.status(200).json({ message: "Successfully updated recipe!" });
    console.log("Successfully updated recipe!");
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
});

recipeRoutes.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const removedRecipe = await Recipe.deleteOne({ _id: id });
    res.status(200).json({ message: "Successfully removed recipe!" });
    console.log("Successfully deleted recipe!");
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
})

module.exports = recipeRoutes;