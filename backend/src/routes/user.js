import express from 'express';
import User from '../models/user';
import { signUp } from '../validations/user';
import { parseError, sessionizeUser } from '../util/helpers';

const userRoutes = express.Router();

// create user
userRoutes.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    await signUp.validateAsync({ username, email, password }, { abortEarly: false });

    const user = await User.findOne({ email: req.body.email });

    if (user) {
      throw new Error('User already exists');
    }

    const newUser = new User({ username, email, password });
    const sessionUser = sessionizeUser(newUser);

    await newUser.save();

    req.session.user = sessionUser;
    res.send(sessionUser);
  } catch (err) {
    res.status(400).send(parseError(err.message));
  }
});

// update user
userRoutes.post('/update', async (req, res) => {
  try {
    const { userId } = req.session.user;
    const user = await User.findById(userId);
    if (user) {
      user.recipes = req.body.recipes;
      user.meals = req.body.meals;
      user.ratings = req.body.ratings;
      await user.save();
      res.send('Update success');
    } else {
      res.status(404).send('User not found!');
    }
  } catch (err) {
    res.status(500).send(parseError(err.message));
  }
});

export default userRoutes;
