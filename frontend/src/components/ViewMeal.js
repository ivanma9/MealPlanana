import { MdEdit } from 'react-icons/md';
import { BsFillTrashFill } from 'react-icons/bs';
import React, { Component } from 'react';
import { Button, ListGroup, Container } from 'react-bootstrap';
import ReactHtmlParser from 'react-html-parser';
import { connect } from 'react-redux';
import { updateMeals } from '../actions/session';

const daysOfWeekDict = {
  0: 'Sun',
  1: 'Mon', // 'tu',
  2: 'Tue', // 'we',
  3: 'Wed', // 'th',
  4: 'Thu', // 'fr',
  5: 'Fri', // 'sa',
  6: 'Sat', // 'su',
};
export class ViewMeal extends Component {
  constructor(props) {
    super(props);
    this.mealInfo = {};
    this.recipeInfo = [];
    this.header = '';

    this.state = {

    };
    this.editMeal = this.editMeal.bind(this);
    this.deleteMeal = this.deleteMeal.bind(this);
  }

  editMeal() {
    // TODO: Add Meal Extension
  }

  deleteMeal() {
    // TODO: Delete meal endpt
  }

  militaryToStandardTime(time) {
    time = time.split(':');

    // fetch
    const hours = Number(time[0]);
    const minutes = Number(time[1]);

    // calculate
    let timeValue;

    if (hours > 0 && hours <= 12) {
      timeValue = `${hours}`;
    } else if (hours > 12) {
      timeValue = `${hours - 12}`;
    } else if (hours == 0) {
      timeValue = '12';
    }

    timeValue += (minutes < 10) ? `:0${minutes}` : `:${minutes}`; // get minutes
    timeValue += (hours >= 12) ? ' P.M.' : ' A.M.'; // get AM/PM
    return timeValue;
  }

  daysOfWeekListGroup(days) {
    // TODO daysOfweek Move LISTGROUP

    const array = [];
    console.log(days);
    // array.push(<ListGroup.Item className="text-center" variant={color}>sun</ListGroup.Item>)
    for (const ind in days) {
      let color = 'item';
      if (days[ind - 1]) {
        color = 'chosen';
      }
      array.push(<ListGroup.Item className="text-center" variant={color}>{daysOfWeekDict[ind]}</ListGroup.Item>);
    }
    return array;
  }

  displayRecipes(recipeList) {
    return recipeList.map((recipe) => (
      <div>
        <h2>{recipe.title}</h2>
        <p>
          {ReactHtmlParser(recipe.description)}
          {' '}
        </p>
      </div>
    ));
  }

  componentWillUnmount() {
    if (
      this.props.deletedRecipes.length !== 0
    ) {
      console.log(this.props.deletedRecipes.length);
      // TODO search through this.props.meals using this.props.header to get meal index
      let currentMealIndex = -1;
      const currentMeals = this.props.meals;
      for (const i in currentMeals) {
        if (this.props.header === currentMeals[i].title) {
          currentMealIndex = i;
          console.log('found meal index');
          break;
        }
      }
      const newRecipes = currentMeals[currentMealIndex];
      console.log(newRecipes);

      for (const recipeID of this.props.deletedRecipes) {
        console.log(recipeID);

      }
      // const meal = {
      //   title: this.state.mealTitle,
      //   // recipe: mongoose.Types.ObjectId(this.recipeIDs[0]),
      //   recipes: newRecipes,
      //   start_date: startD,
      //   end_date: endD,
      //   days: this.state.weekDays,
      //   duration: parseInt(this.state.duration, 10),
      //   color: this.state.color,
      //   freqType: this.state.freq.toUpperCase(),
      //   interval: parseInt(this.state.interval, 10),
      // };

      // let newMeals = this.props.meals;
      // newMeals = newMeals.concat(meal);
      // this.props.updateMeals(newMeals);
    }
  }

  render() {
    return (
      <div style={{ marginTop: 10, fontSize: 12 }}>
        <Container className="container-fluid">
          <h1>
            {this.props.header}
            <span className="float-right">
              <style type="text/css">
                {`
                  .btn-flat {
                    background-color: #eaf4f4;
                    color: black;
                  }
               
                  .list-group-mine {
                    background-color: #eaf4f4;
                  }
                  .list-group-item{
                    min-width: 6.5em;
                    background-color: #eaf4f4;
                  }
                  .list-group-item-chosen{
                    background-color: #ffe135;
                  }
               
                  .btn-icon {
                    padding: 0.9rem 0.9rem;
                    font-size: 1.5rem;
                    border-radius: 10rem;
                    margin: 0em 0.5em;
                    box-shadow: 10px 10px 5px #aaaaaa;
                  }
                  .btn:hover {
                    padding: 1.1rem 1.1rem;
                  }
                  #timeinfo{
                    font-size: 16px;
                  }
              `}
              </style>
              <Button variant="flat" size="icon" onClick={this.deleteMeal}>
                <MdEdit className="d-flex align-items-center" />
              </Button>
              <Button variant="flat" size="icon" onClick={this.deleteMeal}>
                <BsFillTrashFill className="d-flex align-items-center" color="#eb4511" />
              </Button>
            </span>
          </h1>
        </Container>
        <Container id="Event Calandar Info">
          <p id="timeinfo">
            Time:
            {' '}
            <em>
              {this.militaryToStandardTime(this.props.mealInfo.start_date.slice(11, -8))}
              {' - '}
              {this.militaryToStandardTime(new Date(Date.parse(this.props.mealInfo.end_date)
            + (this.props.mealInfo.duration * 60 * 1000)).toISOString().slice(11, -8))}
            </em>
          </p>
          <br />
          <ListGroup horizontal variant="mine">
            {this.daysOfWeekListGroup(this.props.mealInfo.days)}
          </ListGroup>
        </Container>
        <br />
        <br />
        <Container>
          <div>
            {console.log(this.props.deletedRecipes)}
            {this.displayRecipes(this.props.recipeInfo)}
          </div>

        </Container>

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  meals: state.session.meals,
});


export default connect(
  mapStateToProps,
  { updateMeals },
)(ViewMeal);
