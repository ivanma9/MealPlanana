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
  },
  numRating: { // number of ratings
    type: Number,
  },
  tags: {
    type: [String],
  },
  // date: {
  //   type: Date,
  //   default: Date.now,
  //   // min: '2000-01-01', // can use the Date type to format this
  // },
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
  // images: {
  //   type: [String], // probably just an array of URLs or file paths
  // },
  // comments: {
  //   type: [{
  //     user: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: 'UserSchema',
  //     },
  //     comment: String,
  //   }],
  // },
}, { timestamps: true });

module.exports = mongoose.model('Recipe', RecipeSchema);
// const User = mongoose.model('User', UserSchema);
// export default User;
