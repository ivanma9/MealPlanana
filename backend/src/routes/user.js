import express from 'express';
import multer from 'multer';

import {
  s3bucket, userUploader,
} from '../util/aws-helpers';

import {
  AWS_BUCKET_NAME,
} from '../config';

import User from '../models/user';
import { signUp } from '../validations/user';
import { parseError, sessionizeUser } from '../util/helpers';

const userRoutes = express.Router();

// create user
userRoutes.post('/', userUploader, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    await signUp.validateAsync({ username, email, password }, { abortEarly: false });

    const user = await User.findOne({ email: req.body.email });

    if (user) {
      throw new Error('User already exists');
    }

    const newUser = new User({
      username, email, password,
    });

    if (req.file) {
      const { location, key } = req.file;
      const profile = { location, key };
      newUser.profile = profile;
    }

    const sessionUser = sessionizeUser(newUser);

    await newUser.save();

    req.session.user = sessionUser;
    res.send(sessionUser);
  } catch (err) {
    if (err instanceof multer.MulterError) {
      console.log('AWS/Multer Error in User upload');
      return res.json({
        success: false,
        errors: {
          title: 'Image upload error',
          detail: err.message,
          error: err,
        },
      });
    }
    res.status(400).send(parseError(err.message));
  }
});

// update user
userRoutes.post('/update/', userUploader, async (req, res) => {
  try {
    const { userId } = req.session.user;

    const user = await User.findById(userId);
    if (user) {
      user.recipes = req.body.recipes;
      user.meals = req.body.meals;
      user.ratings = req.body.ratings;
      if (req.file) {
        const { location, key } = req.file;
        const profile = { location, key };
        user.profile = profile;
      }
      await user.save();
      res.send('Update success');
    } else {
      res.status(404).send('User not found!');
    }
  } catch (err) {
    if (err instanceof multer.MulterError) {
      console.log('AWS/Multer Error in User upload');
      return res.json({
        success: false,
        errors: {
          title: 'Image upload error',
          detail: err.message,
          error: err,
        },
      });
    }
    res.status(500).send(parseError(err.message));
  }
});

userRoutes.delete('/delete/', userUploader, async (req, res) => {
  try {
    const { userId } = req.session.user;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }
    const { profile } = user;

    // delete profile from s3 if exists
    if (profile) {
      s3bucket.deleteObject(
        { Bucket: AWS_BUCKET_NAME, Key: profile.key },
        (err, data) => {
          if (err) {
            return res.status(500).json({ message: err });
          }
          console.log('Successfully deleted profile');
        },
      );
    }
    await User.deleteOne({ _id: userId });
    res.status(200).json({ message: 'Successfully removed user!' });
    console.log('Successfully deleted all instances of user!');
  } catch (err) {
    res.status(500).send(parseError(err.message));
  }
});

export default userRoutes;
