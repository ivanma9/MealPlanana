import axios from 'axios';
import Rating from '@material-ui/lab/Rating';
import FavoriteIcon from '@material-ui/icons/Favorite';
import React, { Component } from 'react';
import { Badge, Card, CardDeck } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import {
//   Box, Card as CardB, Image, Heading, Text, Button,
// } from 'rebass';

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
      recipes: [
        {
          _id: 1,
          recipe_title: 'Monki',
          recipe_description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          recipe_image: 'https://s3.amazonaws.com/spectrumnews-web-assets/wp-content/uploads/2018/11/13154625/20181112-SHANK3monkey-844.jpg',
          recipe_ingredients: ['milk', 'oranges', 'bananas'],
          recipe_directions: '1. stir\n2. ok',
          recipe_tags: ['vegan', 'meat lovers'],
          recipe_rating: 4.56,
          recipe_author: 'Alex',
        },
        {
          _id: 2,
          recipe_title: 'Manky',
          recipe_description: 'hello\nnew line test',
          recipe_image: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Vervet_Monkey_%28Chlorocebus_pygerythrus%29.jpg',
          recipe_ingredients: ['coffee', 'apples', 'monkey'],
          recipe_directions: '1. do this\n2. do that',
          recipe_tags: ['monkey-lovers', 'must eat'],
          recipe_rating: 2.00,
          recipe_author: 'Rihanna',
        },
        {
          _id: 3,
          recipe_title: 'Monk',
          recipe_description: '',
          recipe_image: 'https://media.npr.org/assets/img/2015/04/16/mk_jw_dsc_6387_wide-1d6149e0d6c381e7e9ad68d60e889354e3049b22-s800-c85.jpg',
          recipe_ingredients: ['tea', 'macaroni', 'mint'],
          recipe_directions: 'stir. eat',
          recipe_tags: ['stay away', 'vegan', 'healthy'],
          recipe_rating: 3.50,
          recipe_author: 'Uthgerd',
        },
        {
          _id: 4,
          recipe_title: 'Mank',
          recipe_description: 'dfalkje;fkaje;flkaje;fkaje;flkajef;laejf;asiefjas;jf;lksadjf;lasjdf;lkasjdf;laskjf;elakj;alskdjf;alksjdf;lakjsdf;klajsef;laksjef;ashflajshefl;aejf',
          recipe_image: 'https://i.insider.com/5f8865662a400c0019debda6?width=1136&format=jpeg',
          recipe_ingredients: ['noodles', 'plastic', 'love'],
          recipe_directions: 'love it',
          recipe_tags: ['with love', 'valentines dish'],
          recipe_rating: 5.00,
          recipe_author: 'Cupid',
        },
      ],
    };
  }

  componentDidMount() {
    axios
      .get('http://localhost:4000/recipes/')
      .then((response) => {
        // this.setState({ recipes: response.data });
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
