const mongoose = require('mongoose');

const { Schema } = mongoose;

const Recipe = new Schema({
  recipe_title: {
    type: String,
    required: true,
  },
  recipe_description: {
    type: String,
  },
  // recipe_author: {  // either Default, User-created, or Unknown
  //   type: String,
  // },
  recipe_author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  recipe_rating: { // out of 5 stars
    type: Number,
  },
  recipe_tags: {
    type: [String],
  },
  recipe_date: {
    type: Date,
    min: '2000-01-01', // can use the Date type to format this
  },
  recipe_ingredients: {
    type: [String],
  },
  recipe_directions: { // at least 1 step in the recipe
    type: String,
    required: true,
  },
  recipe_descriptions: {
    type: String,
  },
  recipe_images: {
    type: [String], // probably just an array of URLs or file paths
  },
  recipe_comments: {
    type: [String], // NOTE: need to include the user who wrote the comment somewhere
  },
});

module.exports = mongoose.model('Recipe', Recipe);
