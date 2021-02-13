import axios from 'axios';
import React, { Component } from 'react';
import { Card, CardDeck } from 'react-bootstrap';
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
      hoverable
    >
      <Card.Img src={props.recipe.recipe_image} />
      <Card.Title as="h3">
        {props.recipe.recipe_title}
      </Card.Title>
      <Card.Text fontSize={0}>
        {props.recipe.recipe_description}
      </Card.Text>
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
        },
        {
          _id: 2,
          recipe_title: 'Manky',
          recipe_description: 'hello/nnew line test',
          recipe_image: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Vervet_Monkey_%28Chlorocebus_pygerythrus%29.jpg',
        },
        {
          _id: 3,
          recipe_title: 'Monk',
          recipe_description: '',
          recipe_image: 'https://media.npr.org/assets/img/2015/04/16/mk_jw_dsc_6387_wide-1d6149e0d6c381e7e9ad68d60e889354e3049b22-s800-c85.jpg',
        },
        {
          _id: 4,
          recipe_title: 'Mank',
          recipe_description: 'dfalkje;fkaje;flkaje;fkaje;flkajef;laejf;asiefjas;jf;lksadjf;lasjdf;lkasjdf;laskjf;elakj;alskdjf;alksjdf;lakjsdf;klajsef;laksjef;ashflajshefl;aejf',
          recipe_image: 'https://i.insider.com/5f8865662a400c0019debda6?width=1136&format=jpeg',
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
