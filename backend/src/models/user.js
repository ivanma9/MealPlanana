import mongoose from 'mongoose';
import { compareSync, hashSync } from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    reuired: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  //   name: {
  //     type: String,
  //   },
  meals: {
    type: [{
      title: String,
      recipe: mongoose.SchemaTypes.ObjectId,
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

UserSchema.pre('save', function () {
  if (this.isModified('password')) {
    this.password = hashSync(this.password, 10);
  }
});

// UserSchema.statics.doesNotExist = async function (field) {
//   if (this.isNew) {
//     return await this.where(field).countDocuments() === 0;
//   }

//   return true;
// };

UserSchema.methods.comparePasswords = function (password) {
  return compareSync(password, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;
