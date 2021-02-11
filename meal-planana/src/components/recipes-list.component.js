import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Recipe = (props) => (
  <tr>
    <td className={props.recipe.recipe_description ? 'completed' : ''}>
      {props.recipe.recipe_description}
    </td>
    <td className={props.recipe.recipe_description ? 'completed' : ''}>
      {props.recipe.recipe_responsible}
    </td>
    <td className={props.recipe.recipe_description ? 'completed' : ''}>
      {props.recipe.recipe_priority}
    </td>
    <td>
      <Link to={`/edit/${props.recipe._id}`}>Edit</Link>
    </td>
  </tr>
);

export default class RecipesList extends Component {
  constructor(props) {
    super(props);
    this.state = { recipes: [] };
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
        <table
          className="table table-striped"
          style={{ marginTop: 20 }}
        >
          <thead>
            <tr>
              <th>Description</th>
              <th>Responsible</th>
              <th>Priority</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{this.recipeList()}</tbody>
        </table>
      </div>
    );
  }
}
