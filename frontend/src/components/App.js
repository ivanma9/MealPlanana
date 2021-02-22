import React from 'react';
import { Route } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from '../util/route';

import Dashboard from './Dashboard';
import Login from './Login';
import RecipesList from './recipes/RecipesList';
import CreateRecipe from './recipes/CreateRecipe';
import Signup from './Signup';
import ViewRecipe from './recipes/ViewRecipe';
import Welcome from './Welcome';

export default () => (
  <>
    <Route exact path="/" component={Welcome} />
    <AuthRoute path="/login" component={Login} />
    <AuthRoute path="/signup" component={Signup} />
    <ProtectedRoute path="/dashboard" component={Dashboard} />
    <Route
      path="/recipes"
      render={({ match: { url } }) => (
        <>
          <ProtectedRoute path={`${url}/`} component={RecipesList} exact />
          <ProtectedRoute path={`${url}/view/:id`} component={ViewRecipe} />
          <ProtectedRoute path={`${url}/create`} component={CreateRecipe} />
        </>
      )}
    />
    {/* <ProtectedRoute path="/recipes/view/:id" component={ViewRecipe} /> */}
  </>
);
