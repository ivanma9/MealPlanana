import mongoose from 'mongoose';
import { compareSync, hashSync } from 'bcryptjs';

// schema for users!
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  meals: {
    type: [{
      title: String,
      recipes: [mongoose.SchemaTypes.ObjectId],
      start_date: Date,
      end_date: Date,
      days: [Boolean],
      duration: Number,
      color: String,
      freqType: String,
      interval: Number,
    }],
  },
  recipes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Recipe',
  },
  ratings: {
    type: [{
      recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
      },
      rating: Number,
    }],
  },
  profile: {
    type: {
      key: String,
      location: String,
    },
  },

  // THINGS WE COULD IMPLEMENT IN FUTURE

  //   name: {    // actual name instead of using username (customize profile)
  //     type: String,
  //   },
  // favorite_recipes: {  // save certain recipes you like
  //   type: [mongoose.Schema.Types.ObjectId],
  //   ref: 'RecipeSchema'
  // },
  // followers: {
  //   type: [mongoose.Schema.Types.ObjectId],
  //   ref: 'UserSchema'
  // },
  // following: {
  //   type: [mongoose.Schema.Types.ObjectId],
  //   ref: 'UserSchema'
  // },

}, { timestamps: true });

UserSchema.pre('save', function () {
  if (this.isModified('password')) {
    this.password = hashSync(this.password, 10);
  }
});

UserSchema.methods.comparePasswords = function (password) {
  return compareSync(password, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;
