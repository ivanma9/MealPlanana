import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Grid, Typography, TextField, Button,
} from '@material-ui/core';
import { Form } from 'react-bootstrap';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { signup } from '../actions/session';
import { fetchRecipes } from '../actions/recipes';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ffe135',
    },
  },
});

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
    <ThemeProvider theme={theme}>
      <Grid container spacing={5} direction="column" justify="center" alignItems="center" className="mt-3">
        <Grid item>
          <Typography variant="h1">Welcome to MealPlanana!</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h2">Sign Up</Typography>
        </Grid>
        <Grid item style={{ marginBottom: '2rem' }}>
          <Typography variant="button" color="secondary">{errors}</Typography>
        </Grid>

        <Grid container>
          <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Form.Group className="text-center" controlid="formGroupUsername">
              <TextField label="Username" type="username" style={{ width: '20%' }} />
            </Form.Group>

            <br />

            <Form.Group className="text-center" controlid="formGroupEmail">
              <TextField label="Email" type="email" style={{ width: '20%' }} />
            </Form.Group>

            <br />

            <Form.Group className="text-center" controlid="formGroupPassword">
              <TextField label="Password" type="password" style={{ width: '20%' }} />
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
              <Button type="submit" variant="contained" style={{ backgroundColor: '#ffe135', color: 'black' }}>
                Sign Up
              </Button>
            </div>
          </Form>
        </Grid>

        <Grid container direction="row" justify="center" alignItems="baseline" className="mt-5">
          <Typography variant="h6">Already have an account?</Typography>
          <Link to="/login">
            <Button size="large" style={{ color: '#709255', fontWeight: 'bold' }}>Log In</Button>
          </Link>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchtoProps,
)(Signup);
