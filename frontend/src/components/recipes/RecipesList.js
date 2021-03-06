/* eslint no-undef: 0 */ // --> OFF

// TODO: Check to see if global state is updated upon creation or updating of a recipe and if you
//       can avoid fetching all recipes each time you go to this page

// TODO: load recipes to global state initially when the user logs in instead of waiting until they
//       reach this page

import {
  Button, Card, CardContent, CardMedia, Chip, Fab, Grid, IconButton, Snackbar, Typography,
} from '@material-ui/core';
import React, { Component, useEffect, useState } from 'react';

import MuiAlert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import Rating from '@material-ui/lab/Rating';
import ReactHtmlParser from 'react-html-parser';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import EventIcon from '@material-ui/icons/Event';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { Link } from 'react-router-dom';
import { Schema } from 'mongoose';
import { connect } from 'react-redux';

import Search from '../Search/Search';
import AddMeal from '../AddMeal/add-meal.component';
import Modal from '../modal/stdModal.component';
import { addSelectedRecipeToState, fetchRecipes } from '../../actions/recipes';

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

function Recipe(props) {
  const [isSelected, setSelected] = useState(false);

  useEffect(() => {
    if (!props.createMealPromptIsOpen) {
      setSelected(false);
    }
  }, [props.createMealPromptIsOpen]);

  const createMealHandleRecipeSelected = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelected(true);
    props.createMealHandleRecipeSelected(props.recipe);
  };

  const createMealHandleRecipeUnselected = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelected(false);
    props.createMealHandleRecipeUnselected(props.recipe);
  };

  return (
    <Link
      to="/recipes/view"
      style={{ color: 'black', textDecoration: 'none' }}
    >
      <Card
        raised={
          (!props.createMealPromptIsOpen && props.checkIfCurrentCard(props.recipe._id))
          || isSelected
        }
        onMouseOver={() => props.onMouseOver(props.recipe._id)}
        onMouseLeave={() => props.onMouseOut()}
        onClick={() => props.addRecipeToState(props.recipe._id)}
        style={{
          width: '18rem', borderRadius: '10px', padding: '1rem', margin: '2rem',
        }}
      >
        <CardMedia
          component="img"
          image={props.recipe.preview && props.recipe.preview.location}
        />
        <CardContent>
          <Typography variant="h5" align="center">{props.recipe.title}</Typography>
          <Typography
            variant="body1"
            component="span"
            style={{
              overflow: 'hidden', textOverflow: 'ellipsis', wordBreak: 'break-word', hyphens: 'auto',
            }}
          >
            {ReactHtmlParser(props.recipe.description)}
          </Typography>
        </CardContent>
        <div align="center">
          {props.recipe.tags.map((tag, i) => (
            <Chip
              size="small"
              label={tag}
              style={{
                backgroundColor: 'lawngreen', marginLeft: '1%', marginRight: '1%', marginBottom: '2%',
              }}
              // TODO: change i to be a unique identifier
              // can use:
              //   `const myItemsWithIds = myItems.map((item, index) => { ...item, myId: index });`
              key={i}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Rating
            name="hearts"
            defaultValue={0}
            value={props.recipe.ratingTotal}
            precision={0.2}
            icon={<FavoriteIcon fontSize="inherit" />}
            readOnly
            style={{ color: 'red', marginTop: '5%', padding: '5%' }}
          />
          {props.createMealPromptIsOpen && !isSelected
            && (
            <IconButton
              color="primary"
              onClick={(e) => createMealHandleRecipeSelected(e)}
              style={{ marginTop: '5%', padding: '5%' }}
            >
              <CheckIcon />
            </IconButton>
            )}
          {props.createMealPromptIsOpen && isSelected
            && (
            <IconButton
              color="secondary"
              onClick={(e) => createMealHandleRecipeUnselected(e)}
              style={{ marginTop: '5%', padding: '5%' }}
            >
              <CloseIcon />
            </IconButton>
            )}
        </div>
      </Card>
    </Link>
  );
}

class RecipesList extends Component {
  constructor(props) {
    super(props);

    const open = this.props.location.appState !== undefined
      ? this.props.location.appState.open
      : false;

    this.state = {
      open,
      activeCardID: '',
      createMealPromptIsOpen: false,
      createMealSelectedRecipes: [],
    };
  }

  componentDidMount() {
    this.props.fetchRecipes();
  }

  handleCreateMealClick = () => this.setState({ createMealPromptIsOpen: true });

  handleCreateMealPromptClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ createMealPromptIsOpen: false });
  }

  handleCreateMealPromptDoneClick = () => {
    this.addModalRef.current.open();
    // TODO: deal with resetting the selected states for each recipe and finishing the
    //       flow to get rid of the prompt after the user adds their meal
  }

  handleCreateMealPromptCancelClick = () => {
    this.setState({ createMealPromptIsOpen: false, createMealSelectedRecipes: [] });
  }

  onMouseOver = (currentCardID) => this.setState({ activeCardID: currentCardID });

  onMouseOut = () => this.setState({ activeCardID: '' });

  addModalRef = React.createRef();

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
    return this.props.recipes.map(
      (currentRecipe) => (
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
        <Typography variant="h1" align="center">Recipes List</Typography>
        <Search />
        <Grid
          container
          alignItems="flex-start"
          justify="space-evenly"
          // spacing={3}
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
          autoHideDuration={6000}
          open={this.state.open}
          onClose={() => { this.setState({ open: false }); }}
        >
          <MuiAlert elevation={6} variant="filled" severity="success" onClose={() => { this.setState({ open: false }); }}>Recipe successfully created!</MuiAlert>
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
                <Button onClick={this.handleCreateMealPromptDoneClick} size="large">Done</Button>
                <Button onClick={this.handleCreateMealPromptCancelClick} size="large" style={{ color: 'lightcoral' }}>Cancel</Button>
              </div>
            )}
            style={{
              width: '68vw',
              height: '6rem',
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
              Select recipe(s) to add to your meal!
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
          contentStyle={{ width: '30%', height: '35%' }}
          children={<AddMeal />}
          recipes={this.state.createMealSelectedRecipes}
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RecipesList);

// TODO: check if this makes all these props exist with default values if none is given.
//       Would have to change the check if preview exists, for example.
Recipe.propTypes = {
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func,
  checkIfCurrentCard: PropTypes.func,
  addRecipeToState: PropTypes.func,
  createMealPromptIsOpen: PropTypes.bool,
  createMealHandleRecipeSelected: PropTypes.func,
  createMealHandleRecipeUnselected: PropTypes.func,
  recipe: PropTypes.shape({
    _id: Schema.Types.ObjectId.isRequired,
    preview: PropTypes.shape({
      key: PropTypes.string,
      location: PropTypes.string,
    }),
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    ratingTotal: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
};
Recipe.defaultProps = {
  onMouseOver: () => {},
  onMouseOut: () => {},
  checkIfCurrentCard: () => {},
  addRecipeToState: () => {},
  createMealPromptIsOpen: () => {},
  createMealHandleRecipeSelected: () => {},
  createMealHandleRecipeUnselected: () => {},
  recipe: PropTypes.shape({
    preview: null,
    description: '',
    ratingTotal: 0,
    tags: [],
  }),
};

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
