import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { signup } from '../actions/session';
import { fetchRecipes } from '../actions/recipes';

const mapStateToProps = ({ errors, recipes }) => ({
  errors,
  recipes: recipes.items,
});

const mapDispatchtoProps = (dispatch) => ({
  signup: (user) => dispatch(signup(user)),
  fetchRecipes: () => dispatch(fetchRecipes()),
});

const Signup = ({ errors, signup, fetchRecipes }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      username: e.target[0].value,
      email: e.target[1].value,
      password: e.target[2].value,
    };

    signup(user);

    fetchRecipes();
  };

  return (
    <>
      <h1>Signup</h1>
      <p>
        Errors:
        {errors}
      </p>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" />
        </label>
        <label>
          Email:
          <input type="email" name="email" />
        </label>
        <label>
          Password:
          <input type="password" name="password" />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <Link to="/login">Login</Link>
    </>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchtoProps,
)(Signup);
