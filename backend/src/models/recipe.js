import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
  recipe_title: {
    type: String,
    // required: true,
  },
  recipe_author: { // either Default, User-created, or Unknown
  //   type: String,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSchema',
  },
  recipe_rating: { // out of 5 stars
    type: Number,
  },
  recipe_tags: {
    type: [String],
  },
  recipe_date: {
    type: Date,
    default: Date.now,
    // min: '2000-01-01', // can use the Date type to format this
  },
  recipe_ingredients: {
    type: [String],
  },
  recipe_directions: {
    // type: [String],
    type: String,
    // required: true,
  },
  recipe_descriptions: {
    type: String,
  },
  // recipe_images: {
  //   type: [String], // probably just an array of URLs or file paths
  // },
  // recipe_comments: {
  //   type: [{
  //     user: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: 'UserSchema',
  //     },
  //     comment: String,
  //   }],
  // },
  // recipe_comments: {
  //   type: Number,
  // },
}, { timestamps: true });

module.exports = mongoose.model('Recipe', RecipeSchema);
// const User = mongoose.model('User', UserSchema);
// export default User;
