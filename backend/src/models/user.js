import mongoose from 'mongoose';
import { compareSync, hashSync } from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    validate: {
      validator: (username) => User.doesNotExist({ username }),
      message: 'Username already exists',
    },
  },
  email: {
    type: String,
    validate: {
      validator: (email) => User.doesNotExist({ email }),
      message: 'Email already exists',
    },
  },
  password: {
    type: String,
    // required: true,
  },
  name: {
    type: String,
  },
  meals: {
    type: [{
      recipe: mongoose.SchemaTypes.ObjectId,
      date: Date,
      duration: Number,
      color: String,
      recurring: [String],
      end_date: Date,
    }],
  },
  recipes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Recipe',
  },
  ratings: {
    type: [{
      recipeID: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Recipe',
      },
      rating: Number,
    }],
  },
  // favorite_recipes: {
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

UserSchema.pre('save', () => {
  if (this.isModified('password')) {
    this.password = hashSync(this.password, 10);
  }
});

UserSchema.statics.doesNotExist = async (field) => await this.where(field).countDocuments() === 0;

UserSchema.methods.comparePasswords = (password) => compareSync(password, this.password);

const User = mongoose.model('User', UserSchema);
export default User;
