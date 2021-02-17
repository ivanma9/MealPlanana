import express from 'express';
import User from '../models/user';
import { signUp } from '../validations/user';
import { parseError, sessionizeUser } from '../util/helpers';

const userRoutes = express.Router();

userRoutes.post('', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    await signUp.validateAsync({ username, email, password }, { abortEarly: false });

    const newUser = new User({ username, email, password });
    const sessionUser = sessionizeUser(newUser);
    await newUser.save();

    req.session.user = sessionUser;
    res.send(sessionUser);
  } catch (err) {
    res.status(400).send(parseError(err));
  }
});

export default userRoutes;
