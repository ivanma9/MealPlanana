import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  author: { // either Default, User-created, or Unknown
  //   type: String,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
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
    // type: [String],
    type: String,
    // required: true,
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
  prepTime: {
    type: Number,
  },
  servingSize: {
    type: Number,
    min: 1,
  },
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
