import { AuthRoute, ProtectedRoute } from '../util/route';

import Dashboard from './Dashboard';
import Login from './Login';
import React from 'react';
import RecipesList from './recipes/RecipesList';
import { Route } from 'react-router-dom';
import Signup from './Signup';
import ViewRecipe from './recipes/ViewRecipe';
import Welcome from './Welcome';

export default () => (
  <>
    <Route exact path="/" component={Welcome} />
    <AuthRoute path="/login" component={Login} />
    <AuthRoute path="/signup" component={Signup} />
    <ProtectedRoute path="/dashboard" component={Dashboard} />
    <ProtectedRoute path="/recipes" component={RecipesList} />
    <ProtectedRoute path="/view/:id" component={ViewRecipe} />
  </>
);
