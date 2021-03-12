/* eslint no-undef: 0 */ // --> OFF

// TODO: Check to see if global state is updated upon creation or updating of a recipe and if you
//       can avoid fetching all recipes each time you go to this page

// TODO: periodically fetch from the db anyway to ensure data is up to date and nothing went wrong

import {
  Button,
  Fab,
  Grid,
  Snackbar,
  Typography,
} from '@material-ui/core';
import React, { Component } from 'react';

import AddIcon from '@material-ui/icons/Add';
import EventIcon from '@material-ui/icons/Event';
import { Link } from 'react-router-dom';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import MuiAlert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AddMeal from '../AddMeal/add-meal.component';
import Modal from '../modal/stdModal.component';
import Recipe from './Recipe';
import Search from '../Search/Search';
import { addSelectedRecipeToState, fetchRecipes } from '../../actions/recipes';
import LoadingPage from '../LoadingPage';

const mapStateToProps = (state) => ({
  // * recipes comes from the root reducer definition
  recipes: state.recipes.items,
  loading: state.recipes.loading,
  error: state.recipes.error,
});

const mapDispatchToProps = (dispatch) => ({
  fetchRecipes: () => dispatch(fetchRecipes()),
  addRecipeToState: (id) => dispatch(addSelectedRecipeToState(id)),
});

const MAX_RECIPES_FOR_MEAL_CREATION = 20;

class RecipesList extends Component {
  constructor(props) {
    super(props);

    //* we only set createPressed if appState isn't undefined to prevent errors
    //* if undefined, defaults to false
    //* this dictates whether the Snackbar alert pops up on mount
    const createPressed = this.props.location.appState !== undefined
      ? this.props.location.appState.createPressed
      : false;

    this.state = {
      createPressed,
      activeCardID: '',
      createMealPromptIsOpen: false,
      createMealSelectedRecipes: [],
      searchResults: [],
    };
  }

  // TODO: add check here so you don't always fetch on mount
  componentDidMount() {
    this.props.fetchRecipes();
  }

  handleCreateMealClick = () => this.setState({ createMealPromptIsOpen: true, createMealSelectedRecipes: [] });

  handleCreateMealPromptClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ createMealPromptIsOpen: false });
  }

  handleCreateMealPromptDoneClick = () => {
    this.addModalRef.current.open();
    this.handleCreateMealPromptClose();
    // TODO: deal with resetting the selected states for each recipe and finishing the
    //       flow to get rid of the prompt after the user adds their meal
  }

  handleCreateMealPromptCancelClick = () => {
    this.setState({ createMealPromptIsOpen: false, createMealSelectedRecipes: [] });
  }

  onMouseOver = (currentCardID) => this.setState({ activeCardID: currentCardID });

  onMouseOut = () => this.setState({ activeCardID: '' });

  addModalRef = React.createRef();

  searchRef = React.createRef();

  checkIfCurrentCard = (currentID) => this.state.activeCardID === currentID;

  createMealHandleRecipeSelected = (recipe) => {
    this.setState((prevState) => ({
      createMealSelectedRecipes: prevState.createMealSelectedRecipes.concat(recipe),
    }));
  };

  createMealHandleRecipeUnselected = (recipe) => {
    this.setState((prevState) => ({
      createMealSelectedRecipes:
        prevState.createMealSelectedRecipes.filter((item) => item !== recipe),
    }));
  };

  recipeList() {
    let { searchResults } = this.state;
    if (!searchResults || searchResults.length === 0) {
      searchResults = this.props.recipes;
    }
    return searchResults.map(
      (currentRecipe) => (
        //* functions passed as props so Recipe can use them
        <Recipe
          recipe={currentRecipe}
          key={currentRecipe._id}
          onMouseOver={this.onMouseOver}
          onMouseOut={this.onMouseOut}
          checkIfCurrentCard={this.checkIfCurrentCard}
          addRecipeToState={this.props.addRecipeToState}
          createMealPromptIsOpen={this.state.createMealPromptIsOpen}
          createMealHandleRecipeSelected={this.createMealHandleRecipeSelected}
          createMealHandleRecipeUnselected={this.createMealHandleRecipeUnselected}
          createMealSelectedRecipesLength={this.state.createMealSelectedRecipes.length}
          MAX_RECIPES_FOR_MEAL_CREATION={MAX_RECIPES_FOR_MEAL_CREATION}
          // fetchRecipes={this.props.fetchRecipes}
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
      return <LoadingPage />;
    }

    return (
      <div>
        <Typography variant="h1" align="center">Recipes List</Typography>
        <Search
          ref={this.searchRef}
          recipes={this.props.recipes}
          updateParent={(searchResults) => { this.setState({ searchResults }); }}
        />
        <Grid
          container
          alignItems="flex-start"
          justify="space-evenly"
          // spacing={3}
          style={{ paddingBottom: '10rem' }}
        >
          {this.recipeList()}
        </Grid>
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          rowGap: '1em',
          alignItems: 'flex-end',
        }}
        >
          <Link
            to="/recipes/create"
            style={{ color: 'black', textDecoration: 'none' }}
          >
            <Fab
              variant="extended"
              style={{
                backgroundColor: 'orange',
              }}
            >
              <AddIcon />
              New Recipe
            </Fab>
          </Link>
          <Fab
            variant="extended"
            style={{
              backgroundColor: 'skyblue',
            }}
            onClick={this.handleCreateMealClick}
          >
            <EventIcon />
            Create Meal
          </Fab>
        </div>
        <Snackbar
          autoHideDuration={3000}
          open={this.state.createPressed}
          onClose={() => this.setState({ createPressed: false })}
        >
          <MuiAlert elevation={6} variant="filled" severity="success" onClose={() => { this.setState({ createPressed: false }); }}>Recipe successfully created!</MuiAlert>
        </Snackbar>
        <Snackbar
          open={this.state.createMealPromptIsOpen}
          onClose={this.handleCreateMealPromptClose}
        >
          <MuiAlert
            elevation={2}
            variant="standard"
            severity="info"
            icon={<MenuBookIcon fontSize="large" />}
            action={(
              <div>
                <Button onClick={this.handleCreateMealPromptDoneClick} size="large" disabled={this.state.createMealSelectedRecipes.length === 0}>Done</Button>
                <Button onClick={this.handleCreateMealPromptCancelClick} size="large" style={{ color: 'lightcoral' }}>Cancel</Button>
              </div>
            )}
            style={{
              width: '68vw',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {/* TODO: horizontally center this text */}
            <Typography
              variant="button"
              align="right"
              gutterBottom
              style={{
                fontSize: 30,
              }}
            >
              Select up to
              {' '}
              {MAX_RECIPES_FOR_MEAL_CREATION}
              {' '}
              recipe(s) to add to your meal!
            </Typography>
          </MuiAlert>
        </Snackbar>
        <Modal
          ref={this.addModalRef}
          header={(
            <h3>
              {'  '}
              Add Meal
            </h3>
          )}
          contentStyle={{ width: 500, height: 'fit-content', overflow: 'visible' }}
        >
          <AddMeal onSubmit={() => this.addModalRef.current.close()} buttonTitle="Add Meal" recipes={this.state.createMealSelectedRecipes} />
        </Modal>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RecipesList);

RecipesList.propTypes = {
  fetchRecipes: PropTypes.func,
  location: PropTypes.shape({
    appState: PropTypes.shape({
      open: PropTypes.bool,
    }),
  }),
  // TODO: eventually change this to PropTypes.shape({}) and add recipe validation
  //       once you take the recipe out of the global state
  recipes: PropTypes.arrayOf(PropTypes.object),
  addRecipeToState: PropTypes.func,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  loading: PropTypes.bool,
};

RecipesList.defaultProps = {
  fetchRecipes: () => {},
  location: {
    appState: {
      open: false,
    },
  },
  recipes: [],
  addRecipeToState: () => {},
  error: null,
  loading: false,
};
