import { AuthRoute, ProtectedRoute } from '../util/route';
import { Link, Route, BrowserRouter as Router } from 'react-router-dom';

import Dashboard from './Dashboard';
import Login from './Login';
import React from 'react';
import RecipesList from './recipes/RecipesList';
import Signup from './Signup';
import Welcome from './Welcome';

export default () => (
  <>
    <Route exact path="/" component={Welcome} />
    <AuthRoute path="/login" component={Login} />
    <AuthRoute path="/signup" component={Signup} />
    <ProtectedRoute path="/dashboard" component={Dashboard} />
    <ProtectedRoute path="/recipes" component={RecipesList} />
  </>

  // {/* <Router>
  // <div className="container">
  //   <nav className="navbar navbar-expand-lg navbar-light bg-light">
  //     <a
  //       className="navbar-brand"
  //       href="https://codingthesmartway.com"
  //       target="_blank"
  //     />
  //     <Link to="/" className="navbar-brand">
  //       Meal Planana
  //     </Link>
  //     <div className="collpase navbar-collapse">
  //       <ul className="navbar-nav mr-auto">
  //         <li className="navbar-item">
  //           <Link to="/" className="nav-link">
  //             Recipes
  //           </Link>
  //         </li>
  //         <li className="navbar-item">
  //           <Link to="/create" className="nav-link">
  //             Create Recipe
  //           </Link>
  //         </li>
  //       </ul>
  //     </div>
  //   </nav>
  //   <br />
  //   <Route path="/" exact component={RecipesList} />
  // {/* <Route path="/edit/:id" component={EditRecipe} /> */}
  // {/* <Route path="/create" component={CreateRecipe} /> */}
  // {/* <Route path="/view/:id" component={ViewRecipe} /> */}
  //   </div>
  // </Router> */}
);
