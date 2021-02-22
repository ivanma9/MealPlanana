import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Typography,
  Snackbar,
} from '@material-ui/core';
import React, { Component } from 'react';

import FavoriteIcon from '@material-ui/icons/Favorite';
import { Link } from 'react-router-dom';
import Rating from '@material-ui/lab/Rating';
import { connect } from 'react-redux';
import MuiAlert from '@material-ui/lab/Alert';
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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
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
        {/* <CardMedia
        component="img"
        image={props.recipe.image}
      /> */}
        <CardContent>
          <Typography variant="h5" align="center">{props.recipe.title}</Typography>
          <Typography
            variant="body1"
            style={{
              overflow: 'hidden', textOverflow: 'ellipsis', wordBreak: 'break-word', hyphens: 'auto',
            }}
          >
            {props.recipe.description}
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
    // this.setState({
    //   open: this.props.location.appState.open,
    // });
  }

  // componentDidUpdate(prevProps) {
  //   console.log('didupdate');
  //   if (this.state.open !== this.props.location.appState.open) {
  //     console.log('if');
  //     this.setState({
  //       open: this.props.location.appState.open,
  //     });
  //   }
  // }

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

    // if (this.props.location.state.open) {
    //   console.log('succ');
    //   // open = true;
    // }

    // const handleClose = () => { open = false; };

    return (
      <div>
        {/* {console.log(this.props.location.state.createSuccessful)} */}
        {/* {this.props.location.state.createSuccessful
          && ( */}
        <Snackbar
          autoHideDuration={6000}
          open={this.state.open}
          // open={this.props.location.appState.open}
          onClose={() => { this.setState({ open: false }); console.log(this.state.open); }}
          // onClose={() => { this.props.location.appState.open = false; console.log(this.state.open); }}
        >
          <Alert severity="success" onClose={() => { this.setState({ open: false }); console.log(this.state.open); }}>Recipe successfully created!</Alert>
        </Snackbar>
        {/* )} */}
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
