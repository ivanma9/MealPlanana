import { GiMeal, GiBananaBunch } from 'react-icons/gi';
import React, { Component } from 'react';
import TimePicker from 'react-time-picker';
import PropTypes from 'prop-types';

export default class AddMeal extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.onSubmit = this.onSubmit.bind(this);
    this.getMeal = this.getMeal.bind(this);
    this.onChangeRecipeTitle = this.onChangeRecipeTitle.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();

    // const newRecipe = {
    //   recipe_description: this.state.recipe_description,
    //   recipe_responsible: this.state.recipe_responsible,
    //   recipe_priority: this.state.recipe_priority,
    //   recipe_completed: this.state.recipe_completed,
    // };

    // axios
    //   .post('http://localhost:4000/recipes/add', newRecipe)
    //   .then((res) => console.log(res.data));

    this.setState({
      startTime: null,
      endTime: null,
    });
    this.props.onSubmit();
  }

  onChangeRecipeTitle(e) {
    this.setState({ mealTitle: e.target.value });
  }

  getMeal() {
    return (
      {
        groupID: 'test',
        title: this.state.mealTitle,
        daysOfWeek: ['1'],
        date: '2021-02-22',
        color: 'red',
        startTime: `${this.state.startTime}:00`,
        endTime: `${this.state.endTime}:00`,
      });
  }

  render() {
    return (
      <div style={{ marginTop: 10 }}>
        <h3>
          <GiMeal size={40} />
          {'  '}
          Add Meal
        </h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>
              <GiBananaBunch size={20} />
              {' '}
              Title
            </label>
            <input
              type="text"
              className="form-control"
              value={this.state.recipe_title}
              onChange={this.onChangeRecipeTitle}
            />
          </div>
          <div>
            <label>
              Start Time
            </label>
            <TimePicker
              onChange={(value) => {
                this.setState({ startTime: value });
                console.log('TIME DATA: ', value);
              }}
              value={this.state.startTime}
              format="hh:mm a"
            />
            <br />
            <label>
              End time
            </label>
            <TimePicker
              onChange={(value) => { this.setState({ endTime: value }); }}
              value={this.state.endTime}
            />
          </div>
          <div className="form-group">
            <input
              type="submit"
              value="Add Meal"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}
AddMeal.propTypes = {
  onSubmit: PropTypes.func,
};
AddMeal.defaultProps = {
  onSubmit: () => {},
};
