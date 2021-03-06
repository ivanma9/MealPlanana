// TODO: Check to see if global state is updated upon creation or updating of a recipe and if you
//       can avoid fetching all recipes each time you go to this page

import {
  Button,
  Fab,
  Grid,
  Snackbar,
  Typography,
} from '@material-ui/core';
import React, { Component } from 'react';

import AddIcon from '@material-ui/icons/Add';
import { Link } from 'react-router-dom';
import MuiAlert from '@material-ui/lab/Alert';
import { connect } from 'react-redux';
import { fetchRecipes, addSelectedRecipeToState } from '../../actions/recipes';
import Recipe from './Recipe';

const mapStateToProps = (state) => ({
  // * recipes comes from the root reducer definition
  recipes: state.recipes.items,
  loading: state.recipes.loading,
  error: state.recipes.error,
  userID: state.session.userId,
});

const mapDispatchToProps = (dispatch) => ({
  fetchRecipes: () => dispatch(fetchRecipes()),
  addRecipeToState: (id) => dispatch(addSelectedRecipeToState(id)),
});

class MyRecipes extends Component {
  constructor(props) {
    super(props);

    const createPressed = this.props.location.appState !== undefined
      ? this.props.location.appState.createPressed
      : false;

    this.state = {
      createPressed,
      activeCardID: '',
    };
  }

  componentDidMount() { // TODO: FILTER HERE
    // Not sure if we need to fetch again, aren't they already in our state
    // console.log(this.props.recipes);
    this.props.fetchRecipes();
    // console.log(this.props.recipes);
  }

  onMouseOver = (currentCardID) => this.setState({ activeCardID: currentCardID });

  onMouseOut = () => this.setState({ activeCardID: '' });

  checkIfCurrentCard = (currentID) => this.state.activeCardID === currentID;

  myRecipes() {
    return this.props.recipes.filter((item) => {
      if (!this.props.userID) return false;
      if (item.author && item.author.id === this.props.userID) return true;
    }).map(
      (currentRecipe) => (
        <Recipe
          recipe={currentRecipe}
          key={currentRecipe._id}
          onMouseOver={this.onMouseOver}
          onMouseOut={this.onMouseOut}
          checkIfCurrentCard={this.checkIfCurrentCard}
          addRecipeToState={this.props.addRecipeToState}
        />
      ),
    );
  }

  render() {
    const { error, loading } = this.props;

    if (error) {
      return (
        <Typography variant="h1" align="center">
          Error!
          {' '}
          {error.message}
        </Typography>
      );
    }
    if (loading) {
      return <Typography variant="h1" align="center">Loading...</Typography>;
    }

    return (
      <div>
        <Typography variant="h1" align="center">My Recipes</Typography>
        <Grid
          container
          alignItems="flex-start"
          justify="space-evenly"
          // spacing={3}
        >
          {this.myRecipes()}
          {console.log(this.myRecipes())}
        </Grid>
        <Link
          to="/recipes/create"
          style={{ color: 'black', textDecoration: 'none' }}
        >
          <Fab
            variant="extended"
            style={{
              position: 'fixed', bottom: '2rem', right: '2rem', backgroundColor: 'orange',
            }}
          >
            <AddIcon />
            New Recipe
          </Fab>
        </Link>
        <Snackbar
          autoHideDuration={6000}
          open={this.state.createPressed}
          onClose={() => { this.setState({ createPressed: false }); }}
        >
          <MuiAlert elevation={6} variant="filled" severity="success" onClose={() => { this.setState({ createPressed: false }); }}>Recipe successfully created!</MuiAlert>
        </Snackbar>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyRecipes);
