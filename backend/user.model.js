const mongoose = require('mongoose');

const { Schema } = mongoose;

const User = new Schema({
  user_name: {    // 
    type: String,
    required: true,
  },
  // user_author: {  // either Default, User-created, or Unknown
  //   type: String,
  // },
  user_recipes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Recipe'
  },
  user_directions: {  // at least 1 step in the user
    type: [String],
    required: true,
  },
  user_descriptions: {
    type: String,
  },
  user_images: {
    type: [String],    // probably just an array of URLs or file paths
  },
  user_comments: {
    type: [String]    // NOTE: need to include the user who wrote the comment somewhere
  }
});

module.exports = mongoose.model('User', User);
