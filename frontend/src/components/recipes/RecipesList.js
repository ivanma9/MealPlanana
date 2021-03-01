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
import Rating from '@material-ui/lab/Rating';
import { connect } from 'react-redux';
import ReactHtmlParser from 'react-html-parser';
import { fetchRecipes } from '../../actions/recipes';

const mapStateToProps = (state) => ({
  // * recipeList comes from the root reducer definition
  recipes: state.recipeList.items,
  loading: state.recipeList.loading,
  error: state.recipeList.error,
});

const mapDispatchToProps = (dispatch) => ({
  fetchRecipes: () => dispatch(fetchRecipes()),
});
// * or comment this out and add { fetchRecipes } to the connect function.

// FIXME: Card raised property not working.
//        Only being called once per card on initial load, and prints false.

let activeCardID = '';
const onMouseOver = (currentCardID) => { activeCardID = currentCardID; };
const onMouseOut = () => { activeCardID = ''; };

// const checkIfCurrentCard = (currentID) => activeCardID === currentID;
function checkIfCurrentCard(currentID) {
  const x = activeCardID === currentID;
  // console.log(x);
  return x;
}

function Recipe(props) {
  return (
    <Link
      to={`/recipes/view/${props.recipe._id}`}
      style={{ color: 'black', textDecoration: 'none' }}
    >
      <Card
        raised={checkIfCurrentCard(props.recipe._id)}
        onMouseOver={() => onMouseOver(props.recipe._id)}
        onMouseLeave={() => onMouseOut()}
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
        <div
          className="row"
          align="center"
        >
          {props.recipe.tags.map((tag, i) => (
            <Chip
              size="small"
              label={tag}
              style={{
                backgroundColor: 'lawngreen', marginLeft: '1%', marginRight: '1%', marginBottom: '2%',
              }}
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
      };
    } else {
      this.state = {
        open: false,
      };
    }
  }

  componentDidMount() {
    this.props.fetchRecipes();
  }

  recipeList() {
    return this.props.recipes.map(
      (currentRecipe, i) => <Recipe recipe={currentRecipe} key={i} raised={false} />,
    );
  }

  render() {
    const { error, loading, recipes } = this.props;

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
          {/* {recipes.map(
            (currentRecipe, i) => <Recipe recipe={currentRecipe} key={i} raised={false} />,
          )} */}
        </Grid>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  // { fetchRecipes },
)(RecipesList);