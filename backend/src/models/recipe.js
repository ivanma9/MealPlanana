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
  // images: { // just get 1 to work for now
  //   data: Buffer, // probably just an array of URLs or file paths
  //   contentType: String,
  // },
  // images: {
  //   document_id: { type: Number, default: 0 },
  //   description: { type: String },
  //   fileLink: { type: String },
  //   s3_key: { type: String },
  // },
  images: {
    type: [String],
  },
  image: {
    type: String,
  },
  // comments: {  // maybe call this 'reviews'
  //   type: [{
  //     user: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: 'UserSchema',
  //     },
  //     comment: String,
  //   }],
  // },
}, { timestamps: true });

// module.exports = mongoose.model('Recipe', RecipeSchema);
const Recipe = mongoose.model('Recipe', RecipeSchema);
export default Recipe;
// const User = mongoose.model('User', UserSchema);
// export default User;
