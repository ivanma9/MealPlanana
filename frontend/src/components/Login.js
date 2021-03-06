import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { login } from '../actions/session';
import { fetchRecipes } from '../actions/recipes';

const mapStateToProps = ({ errors, recipes }) => ({
  errors,
  recipes: recipes.items,
});

const mapDispatchtoProps = (dispatch) => ({
  login: (user) => dispatch(login(user)),
  fetchRecipes: () => dispatch(fetchRecipes()),
});

const Login = ({ errors, login, fetchRecipes }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      email: e.target[0].value,
      password: e.target[1].value,
    };

    login(user);

    fetchRecipes();
  };

  return (
    <>
      <h1>Login</h1>
      <p>{errors}</p>
      <form onSubmit={handleSubmit}>
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
      <Link to="/signup">Signup</Link>
    </>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchtoProps,
)(Login);
