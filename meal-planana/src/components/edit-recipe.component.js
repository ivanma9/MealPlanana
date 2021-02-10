import React, { Component } from 'react';
import axios from 'axios';

export default class EditRecipe extends Component {
  constructor(props) {
    super(props);

    this.onChangeRecipeDescription = this.onChangeRecipeDescription.bind(
      this,
    );
    this.onChangeRecipeResponsible = this.onChangeRecipeResponsible.bind(
      this,
    );
    this.onChangeRecipePriority = this.onChangeRecipePriority.bind(this);
    this.onChangeRecipeCompleted = this.onChangeRecipeCompleted.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      recipe_description: '',
      recipe_responsible: '',
      recipe_priority: '',
      recipe_completed: false,
    };
  }

  componentDidMount() {
    axios
      .get(`http://localhost:4000/recipes/${this.props.match.params.id}`)
      .then((response) => {
        this.setState({
          recipe_description: response.data.recipe_description,
          recipe_responsible: response.data.recipe_responsible,
          recipe_priority: response.data.recipe_priority,
          recipe_completed: response.data.recipe_completed,
        });
      })
      .catch((error) => {
        console.log(error);
      });
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

  onChangeRecipeCompleted(e) {
    this.setState({
      recipe_completed: !this.state.recipe_completed,
    });
  }

  onSubmit(e) {
    e.preventDefault();
    const obj = {
      recipe_description: this.state.recipe_description,
      recipe_responsible: this.state.recipe_responsible,
      recipe_priority: this.state.recipe_priority,
      recipe_completed: this.state.recipe_completed,
    };

    console.log(obj);

    axios
      .post(
        `http://localhost:4000/recipes/update/${
					 this.props.match.params.id}`,
        obj,
      )
      .then((res) => console.log(res.data));

    this.props.history.push('/');
  }

  render() {
    return (
      <div>
        <h3 align="center">Update Recipe</h3>
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
          <div className="form-check">
            <input
              className="form-check-input"
              id="completedCheckbox"
              type="checkbox"
              name="completedCheckbox"
              onChange={this.onChangeRecipeCompleted}
              checked={this.state.recipe_completed}
              value={this.state.recipe_completed}
            />
            <label
              className="form-check-label"
              htmlFor="completedCheckbox"
            >
              Completed
            </label>
          </div>

          <br />

          <div className="form-group">
            <input
              type="submit"
              value="Update Recipe"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}
