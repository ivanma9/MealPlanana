// TODO: Check to see if global state is updated upon creation or updating of a recipe and if you
//       can avoid fetching all recipes each time you go to this page

import {
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
  // * recipeList comes from the root reducer definition
  recipes: state.recipeList.items,
  loading: state.recipeList.loading,
  error: state.recipeList.error,
});

const mapDispatchToProps = (dispatch) => ({
  fetchRecipes: () => dispatch(fetchRecipes()),
  addRecipeToState: (id) => dispatch(addSelectedRecipeToState(id)),
});

class RecipesList extends Component {
  constructor(props) {
    super(props);
    if (this.props.location.appState !== undefined) {
      this.state = {
        open: this.props.location.appState.open,
        activeCardID: '',
      };
    } else {
      this.state = {
        open: false,
        activeCardID: '',
      };
    }
  }

  componentDidMount() {
    this.props.fetchRecipes();
  }

  onMouseOver = (currentCardID) => this.setState({ activeCardID: currentCardID });

  onMouseOut = () => this.setState({ activeCardID: '' });

  checkIfCurrentCard = (currentID) => this.state.activeCardID === currentID;

  recipeList() {
    return this.props.recipes.map(
      (currentRecipe, i) => (
        <Recipe
          recipe={currentRecipe}
          key={i}
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
            New
          </Fab>
        </Link>
        <Snackbar
          autoHideDuration={6000}
          open={this.state.open}
          onClose={() => { this.setState({ open: false }); }}
        >
          <MuiAlert elevation={6} variant="filled" severity="success" onClose={() => { this.setState({ open: false }); }}>Recipe successfully created!</MuiAlert>
        </Snackbar>
        <Typography variant="h1" align="center">Recipes List</Typography>
        <Grid
          container
          alignItems="flex-start"
          justify="space-evenly"
          // spacing={3}
        >
          {this.recipeList()}
        </Grid>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RecipesList);
