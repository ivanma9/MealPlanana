import { Badge, Card, CardDeck } from 'react-bootstrap';
import React, { Component } from 'react';

import FavoriteIcon from '@material-ui/icons/Favorite';
import { Link } from 'react-router-dom';
import Rating from '@material-ui/lab/Rating';
import axios from 'axios';

const Recipe = (props) => (
  <Link
    to={`/edit/${props.recipe._id}`}
    style={{ color: 'black', textDecoration: 'none' }}
  >
    <Card
      className="shadow p-3 mb-5 bg-white"
      style={{ width: '18rem', borderRadius: '10px' }}
      // hoverable
    >
      <Card.Img
        src={props.recipe.recipe_image}
        // className="mt-5"
      />
      <Card.Title as="h3" className="text-center mt-2">
        {props.recipe.recipe_title}
      </Card.Title>
      <Card.Text fontSize={0}>
        {props.recipe.recipe_description}
      </Card.Text>
      <div
        className="row"
        style={{ justifyContent: 'center' }}
      >
        {props.recipe.recipe_tags.map((tag, i) => <Badge pill style={{ backgroundColor: 'lawngreen', marginLeft: '1%', marginRight: '1%' }} key={i}>{tag}</Badge>)}
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
        <CardDeck>{this.recipeList()}</CardDeck>
      </div>
    );
  }
}
