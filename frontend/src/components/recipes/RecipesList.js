/* eslint no-undef: 0 */ // --> OFF

// TODO: Check to see if global state is updated upon creation or updating of a recipe and if you
//       can avoid fetching all recipes each time you go to this page

import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  Fab,
  Grid,
  Snackbar,
  Typography,
} from '@material-ui/core';
import React, { Component } from 'react';

import AddIcon from '@material-ui/icons/Add';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Link } from 'react-router-dom';
import MuiAlert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import Rating from '@material-ui/lab/Rating';
import ReactHtmlParser from 'react-html-parser';
import { connect } from 'react-redux';
import { Schema } from 'mongoose';
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
  return (
    <Link
      to="/recipes/view"
      style={{ color: 'black', textDecoration: 'none' }}
    >
      <Card
        raised={props.checkIfCurrentCard(props.recipe._id)}
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
        <Rating
          name="hearts"
          defaultValue={0}
          value={props.recipe.ratingTotal}
          precision={0.2}
          icon={<FavoriteIcon fontSize="inherit" />}
          readOnly
          style={{ color: 'red', marginTop: '5%', padding: '5%' }}
        />
      </Card>
    </Link>
  );
}

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

// TODO: check if this makes all these props exist with default values if none is given.
//       Would have to change the check if preview exists, for example.
Recipe.propTypes = {
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func,
  checkIfCurrentCard: PropTypes.func,
  addRecipeToState: PropTypes.func,
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
