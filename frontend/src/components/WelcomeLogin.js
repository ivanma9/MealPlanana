import { Link } from 'react-router-dom';
import React from 'react';
import { connect } from 'react-redux';
import { login } from '../actions/session';

const mapStateToProps = ({ errors }) => ({
  errors,
});

const mapDispatchToProps = (dispatch) => ({
  login: (user) => dispatch(login(user)),
});

const WelcomeLogin = ({ errors, login }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      email: e.target[0].value,
      password: e.target[1].value,
    };

    login(user);
  };

  return (
    <div>
      <h1 style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '5rem',
      }}
      >
        Welcome to MealPlanana!
      </h1>
      <h2 style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      >
        Login

      </h2>
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
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WelcomeLogin);
