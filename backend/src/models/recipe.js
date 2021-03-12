import mongoose from 'mongoose';

// schema for recipes!
const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  author: {
    type: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      username: String,
    },
  },
  // calculate average rating in frontend
  ratingTotal: { // total score of rating
    type: Number,
    default: 0,
    min: 0,
  },
  numRating: { // number of ratings
    type: Number,
    default: 0,
    min: 0,
  },
  tags: {
    type: [String],
  },
  ingredients: {
    type: [String],
  },
  directions: {
    type: String,
  },
  description: {
    type: String,
  },
  images: {
    type: [{
      key: String,
      location: String,
    }],
  },
  preview: {
    type: {
      key: String,
      location: String,
    },
  },
  // THINGS WE COULD IMPLEMENT IN FUTURE

  // prepTime: {
  //   type: Number,
  // },
  // servingSize: {
  //   type: Number,
  //   min: 1,
  // },
  // reviews: {
  //   type: [{
  //     user: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: 'User',
  //     },
  //     comment: String,
  //   }],
  // },

}, { timestamps: true });

const Recipe = mongoose.model('Recipe', RecipeSchema);
export default Recipe;
