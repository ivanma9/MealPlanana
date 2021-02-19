import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Typography,
} from '@material-ui/core';
import React, { Component } from 'react';

import FavoriteIcon from '@material-ui/icons/Favorite';
import { Link } from 'react-router-dom';
import Rating from '@material-ui/lab/Rating';
import { connect } from 'react-redux';
import { fetchRecipes } from '../../actions/recipes';

const mapStateToProps = (state) => ({
  recipes: state.recipes.items,
  loading: state.recipes.loading,
  error: state.recipes.error,
});

// const mapDispatchToProps = (dispatch) => ({
//   fetchRecipes: () => dispatch(fetchRecipes()),
// });

// const RecipesList = ({ error, loading, recipes }) => (
//   <>
//     {recipes.map((recipe) => <li key={recipe._id}>{recipe.title}</li>)}
//   </>
// );
// const state = {
//   raised: false,
// };

let activeCardID = '';
const onMouseOver = (currentCardID) => { activeCardID = currentCardID; console.log('over'); };
const onMouseOut = () => { activeCardID = ''; console.log('out'); };

// const checkIfCurrentCard = (currentID) => activeCardID === currentID;
function checkIfCurrentCard(currentID) {
  const x = activeCardID === currentID;
  console.log(x);
  return x;
}

function Recipe(props) {
  return (
    <Link
      to={`/view/${props.recipe._id}`}
      style={{ color: 'black', textDecoration: 'none' }}
    >
      <Card
        className="p-3 mb-5 bg-white"
        raised={checkIfCurrentCard(props.recipe._id)}
        onMouseOver={() => onMouseOver(props.recipe._id)}
        onMouseLeave={() => onMouseOut()}
        style={{
          width: '18rem', borderRadius: '10px',
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
    // console.log(error);
    // console.log(loading);
    // console.log(recipes);

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
  { fetchRecipes },
  // mapDispatchToProps,
)(RecipesList);
