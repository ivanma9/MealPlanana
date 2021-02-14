const mongoose = require('mongoose');

const { Schema } = mongoose;

//! Commit just for testing
const Recipe = new Schema({
  recipe_title: {
    type: String,
  },
  recipe_description: {
    type: String,
  },
  recipe_ingredients: {
    type: Array,
  },
  recipe_directions: {
    type: String,
  },
  recipe_tags: {
    type: Array,
  },
  recipe_image: {
    type: String,
  },
  recipe_rating: {
    type: Number,
  },
  recipe_author: {
    type: String,
  },
});

module.exports = mongoose.model('Recipe', Recipe);
