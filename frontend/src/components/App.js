import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AuthRoute, ProtectedRoute, ConditionalRoute } from '../util/route';

import CreateRecipe from './recipes/CreateRecipe';
import Dashboard from './Dashboard';
import Navbar from './Navbar';
import RecipesList from './recipes/RecipesList';
import Signup from './Signup';
import ViewRecipe from './recipes/ViewRecipe';
import WelcomeLogin from './WelcomeLogin';
import EditRecipe from './recipes/EditRecipe';
import MyRecipes from './recipes/MyRecipes';

export default () => (
  <>
    <ConditionalRoute path="/" />
    <Switch>
      <AuthRoute path="/login" component={WelcomeLogin} />
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
              <ProtectedRoute path={`${url}/my-recipes`} component={MyRecipes} />
            </>
          )}
        />
      </>
    </Switch>
  </>
);
