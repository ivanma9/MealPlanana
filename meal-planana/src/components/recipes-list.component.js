import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@material-ui/core';
import React, { Component } from 'react';

import { Badge } from 'react-bootstrap';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Link } from 'react-router-dom';
import Rating from '@material-ui/lab/Rating';
import axios from 'axios';

// TODO: only 3 tags showing

let activeCardID = '';

const onMouseOver = (currentCardID) => { activeCardID = currentCardID; };
const onMouseOut = () => { activeCardID = ''; };
const checkIfCurrentCard = (currentID) => activeCardID === currentID;

const Recipe = (props) => (
  <Link
    to={`/view/${props.recipe._id}`}
    style={{ color: 'black', textDecoration: 'none' }}
  >
    <Card
      className="p-3 mb-5 bg-white"
      raised={checkIfCurrentCard(props.recipe._id)}
      onMouseOver={() => onMouseOver(props.recipe._id)}
      onMouseOut={onMouseOut}
      style={{
        width: '18rem', borderRadius: '10px',
      }}
    >
      <CardMedia
        component="img"
        image={props.recipe.recipe_image}
      />
      <CardContent>
        <Typography variant="h5" className="text-center">{props.recipe.recipe_title}</Typography>
        <Typography
          variant="body1"
          style={{
            overflow: 'hidden', textOverflow: 'ellipsis', wordBreak: 'break-word', hyphens: 'auto',
          }}
        >
          {props.recipe.recipe_description}
        </Typography>
      </CardContent>
      <div
        className="row"
        style={{ justifyContent: 'center' }}
      >
        {props.recipe.recipe_tags.map((tag, i) => (
          <Badge
            pill
            style={{
              backgroundColor: 'lawngreen', marginLeft: '1%', marginRight: '1%', marginBottom: '2%',
            }}
            key={i}
          >
            {tag}
          </Badge>
        ))}
      </div>
      <Rating
        name="hearts"
        defaultValue={0}
        value={props.recipe.recipe_rating}
        precision={0.2}
        icon={<FavoriteIcon fontSize="inherit" />}
        readOnly
        style={{ color: 'red', marginTop: '5%' }}
      />
    </Card>
  </Link>
);

export default class RecipesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
    };
  }

  componentDidMount() {
    axios
      .get('http://localhost:4000/recipes/')
      .then((response) => {
        this.setState({ recipes: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidUpdate() {
    axios
      .get('http://localhost:4000/recipes/')
      .then((response) => {
        this.setState({ recipes: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  recipeList() {
    return this.state.recipes.map((currentRecipe, i) => <Recipe recipe={currentRecipe} key={i} />);
  }

  render() {
    return (
      <div>
        <h3>Recipes List</h3>
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
