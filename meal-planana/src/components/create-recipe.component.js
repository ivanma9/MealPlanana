import React, { Component } from 'react';
import axios from 'axios';

export default class CreateRecipe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recipe_description: '',
      recipe_responsible: '',
      recipe_priority: '',
      recipe_completed: false,
    };
    this.onChangeRecipeDescription = this.onChangeRecipeDescription.bind(
      this,
    );
    this.onChangeRecipeResponsible = this.onChangeRecipeResponsible.bind(
      this,
    );
    this.onChangeRecipePriority = this.onChangeRecipePriority.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChangeRecipeDescription(e) {
    this.setState({
      recipe_description: e.target.value,
    });
  }

  onChangeRecipeResponsible(e) {
    this.setState({
      recipe_responsible: e.target.value,
    });
  }

  onChangeRecipePriority(e) {
    this.setState({
      recipe_priority: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();

    console.log('Form submitted:');
    console.log(`Recipe Description: ${this.state.recipe_description}`);
    console.log(`Recipe Responsible: ${this.state.recipe_responsible}`);
    console.log(`Recipe Priority: ${this.state.recipe_priority}`);

    const newRecipe = {
      recipe_description: this.state.recipe_description,
      recipe_responsible: this.state.recipe_responsible,
      recipe_priority: this.state.recipe_priority,
      recipe_completed: this.state.recipe_completed,
    };

    axios
      .post('http://localhost:4000/recipes/add', newRecipe)
      .then((res) => console.log(res.data));

    this.setState({
      recipe_description: '',
      recipe_responsible: '',
      recipe_priority: '',
      recipe_completed: false,
    });
  }

  render() {
    return (
      <div style={{ marginTop: 10 }}>
        <h3>Create New Recipe</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Description: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.recipe_description}
              onChange={this.onChangeRecipeDescription}
            />
          </div>
          <div className="form-group">
            <label>Responsible: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.recipe_responsible}
              onChange={this.onChangeRecipeResponsible}
            />
          </div>
          <div className="form-group">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="priorityOptions"
                id="priorityLow"
                value="Low"
                checked={this.state.recipe_priority === 'Low'}
                onChange={this.onChangeRecipePriority}
              />
              <label className="form-check-label">Low</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="priorityOptions"
                id="priorityMedium"
                value="Medium"
                checked={
									this.state.recipe_priority === 'Medium'
								}
                onChange={this.onChangeRecipePriority}
              />
              <label className="form-check-label">Medium</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="priorityOptions"
                id="priorityHigh"
                value="High"
                checked={this.state.recipe_priority === 'High'}
                onChange={this.onChangeRecipePriority}
              />
              <label className="form-check-label">High</label>
            </div>
          </div>

          <div className="form-group">
            <input
              type="submit"
              value="Create Recipe"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}
