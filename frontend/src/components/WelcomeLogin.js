import { Link } from 'react-router-dom';
import React from 'react';
import { connect } from 'react-redux';
import {
  Grid, Typography, TextField, Button,
} from '@material-ui/core';
import { Form } from 'react-bootstrap';
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
      <Grid container spacing={5} direction="column" justify="center" alignItems="center" className="mt-3">
        <Grid item>
          <Typography variant="h1">Welcome to MealPlanana!</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h2">Login</Typography>
        </Grid>
        <Grid item style={{ marginBottom: '2rem' }}>
          <Typography variant="button" color="secondary">{errors}</Typography>
        </Grid>

        <Grid container>
          <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Form.Group className="text-center" controlid="formGroupEmail">
              <TextField placeholder="Email" type="email" style={{ width: '20%' }} />
            </Form.Group>

            <br />

            <Form.Group className="text-center" controlid="formGroupPassword">
              <TextField placeholder="Password" type="password" style={{ width: '20%' }} />
            </Form.Group>

            <br />

            <div
              className="mt-3"
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
              }}
            >
              <Button type="submit" variant="contained" color="primary">
                Log In
              </Button>
            </div>
          </Form>
        </Grid>

        <Grid container direction="row" justify="center" alignItems="baseline" className="mt-5">
          <Typography variant="h6">Don&apos;t have an account?</Typography>
          <Link to="/signup">
            <Button color="primary" size="medium">Sign Up</Button>
          </Link>
        </Grid>

      </Grid>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WelcomeLogin);
