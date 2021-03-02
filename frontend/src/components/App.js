import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from '../util/route';

import CreateRecipe from './recipes/CreateRecipe';
import Dashboard from './Dashboard';
import Login from './Login';
import Navbar from './Navbar';
import RecipesList from './recipes/RecipesList';
import Signup from './Signup';
import ViewRecipe from './recipes/ViewRecipe';
import Welcome from './Welcome';
import EditRecipe from './recipes/EditRecipe';

export default () => (
  <>
    <Switch>
      <Route exact path="/" component={Welcome} />
      <AuthRoute path="/login" component={Login} />
      <AuthRoute path="/signup" component={Signup} />
      <>
        <Navbar />
        <ProtectedRoute path="/dashboard" component={Dashboard} />
        <Route
          path="/recipes"
          render={({ match: { url } }) => (
            <>
              <ProtectedRoute path={`${url}/`} component={RecipesList} exact />
              <ProtectedRoute path={`${url}/view`} component={ViewRecipe} />
              <ProtectedRoute path={`${url}/create`} component={CreateRecipe} />
              <ProtectedRoute path={`${url}/edit`} component={EditRecipe} />
            </>
          )}
        />
      </>
    </Switch>
  </>
);
