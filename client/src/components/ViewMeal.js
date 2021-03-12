import { MdEdit } from 'react-icons/md';
import { BsFillTrashFill } from 'react-icons/bs';
import React, { Component } from 'react';
import { Button, ListGroup, Container } from 'react-bootstrap';
import ReactHtmlParser from 'react-html-parser';
import { connect } from 'react-redux';
import {
  Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle,
} from '@material-ui/core';
import { updateMeals } from '../actions/session';
import Modal from './modal/stdModal.component';
import EditMeal from './AddMeal/add-meal.component';

const daysOfWeekDict = {
  0: 'Sun', // 'sa',
  1: 'Mon', // 'su',
  2: 'Tue', // 'mo',
  3: 'Wed', // 'tu',
  4: 'Thu', // 'we',
  5: 'Fri', // 'th',
  6: 'Sat', // 'fr',
};
export class ViewMeal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMealIndex: 0,
      deleteDialogOpen: false,
      deleteSuccessful: false,
    };
    this.editMeal = this.editMeal.bind(this);
    this.deleteMeal = this.deleteMeal.bind(this);
  }

  editModalRef = React.createRef();

  editMeal() {
    // TODO: Add Meal Extension
    this.editModalRef.current.open();
  }

  deleteMeal() {
    // TODO: Delete meal endpt
    this.setState({ deleteDialogOpen: true });
  }

  militaryToStandardTime(time) {
    time = time.split(':');
    // fetch
    const hours = Number(time[0]); // UTC => PST
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
    // array.push(<ListGroup.Item className="text-center" variant={color}>sun</ListGroup.Item>)
    for (const ind in days) {
      let color = 'item';
      if (days[ind]) {
        color = 'chosen';
      }
      array.push(<ListGroup.Item key="{ind}" className="text-center" variant={color}>{daysOfWeekDict[ind]}</ListGroup.Item>);
    }
    return array;
  }

  goToRecipe(recipe){
    // TODO: recipe link
  }

  displayRecipes(recipeList) {
    return recipeList.map((recipe) => (
      <div key={recipe.title}>
        <div className="d-flex">
          <h2>{recipe.title}</h2>
          {/* <Link
              to="/recipes/view"
              style={{ color: 'black', textDecoration: 'none', margin: '2rem' }}>
              <Button onClick={()=> this.goToRecipe(recipe)} className="btn-sm rounded-pill ml-auto" variant="moreinfo"> More info </Button>
          </Link> */}
        </div> 
        <p>
          {ReactHtmlParser(recipe.description)}
          {' '}
        </p>
      </div>
    ));
  }

  handleDeleteDialogYes = (e) => {
    this.setState({ deleteDialogOpen: false });
    const currentMealIndex = this.state.currentMealIndex;
    const newMeals = this.props.meals;
    newMeals.splice(currentMealIndex, 1);
    console.log(newMeals);
    this.props.updateMeals(newMeals);

    this.props.parentCallback(true);
  }

  handleDeleteDialogNo = () => {
    this.setState({ deleteDialogOpen: false });
  }

  searchForCurrentMeal() {
    let currentMealIndex = -1;
    const currentMeals = this.props.meals;
    for (const i in currentMeals) {
      if (this.props.header === currentMeals[i].title) {
        currentMealIndex = i;
        break;
      }
    }
    return currentMealIndex;
  }

  editMeal(meal) {
    let newMeals = this.props.meals;
    newMeals = newMeals.concat(meal);
    this.props.updateMeals(newMeals);
  }
  
  viewRecipeList(recipeList){
    let i = 0;
    // return recipeList.map((recipe) => (
    //   <div key={recipe}>
    //     <h3>{recipe.title}</h3>
    //     <p>
    //       {console.log(recipe.title)}
    //       {ReactHtmlParser(recipe.description)}
    //       {' '}
          
    //     </p>
    //   </div>
    // ));
   }

  componentDidMount () {
    this.setState({ currentMealIndex: this.searchForCurrentMeal()}); 
  }
  
  componentWillUnmount() {
    if (
      this.props.deletedRecipes.length !== 0
    ) {
      const currentMealIndex = this.state.currentMealIndex;

      const currentMeal = this.props.meals[currentMealIndex];
      const newRecipes = currentMeal.recipes;
      // console.log(newRecipes);
      // console.log(currentMeals[currentMealIndex]);

      const deletedIndices = [];
      for (const recipeID of this.props.deletedRecipes) {
        for (const index in newRecipes) {
          if (recipeID === newRecipes[index]) {
            deletedIndices.push(index); // add index to deleted indices
          }
        }
      }
      // console.log(deletedIndices);
      for (const deleteIndex of deletedIndices) {
        newRecipes.splice(deleteIndex, 1);
      }
      const meal = {
        title: currentMeal.title,
        recipes: newRecipes,
        start_date: currentMeal.start_date,
        end_date: currentMeal.start_date,
        days: currentMeal.days,
        duration: currentMeal.duration,
        color: currentMeal.color,
        freqType: currentMeal.freqType,
        interval: currentMeal.interval,
      };

      let newMeals = this.props.meals;
      newMeals.splice(currentMealIndex, 1);
      newMeals = newMeals.concat(meal);
      this.props.updateMeals(newMeals);
    }
  }

  render() {
    return (
      <div style={{ marginTop: 10, fontSize: 12 }}>
        <Modal
          ref={this.editModalRef}
          header={(
            <h3>
              {'  '}
              Edit Meal
            </h3>
          )}
          contentStyle={{ width: 500, height: 600, overflow: 'auto'}}
        >
          <EditMeal buttonTitle="Edit Meal" recipes={this.props.recipeInfo} />
          <Container>
            {this.viewRecipeList(this.props.recipes)}
         </Container>
        </Modal>

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
                  .btn-flat:hover {
                    padding: 1.1rem 1.1rem;
                  }
                  #timeinfo{
                    font-size: 16px;
                  }
                  .btn-moreinfo{
                    background-color: #ffe135;
                    border-color: black;
                    border-width: 0.2em;
                  }
              `}
              </style>
              <Button variant="flat" size="icon" onClick={this.editMeal}>
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
              {this.militaryToStandardTime((new Date(this.props.mealInfo.rrule.dtstart)).toString().slice(16))}
              {' - '}
              {this.militaryToStandardTime(new Date(Date.parse(this.props.mealInfo.rrule.dtstart)
            + (this.props.meals[this.state.currentMealIndex].duration * 60 * 1000)).toString().slice(16))}            
            </em>
          </p>
          <br />
          <ListGroup horizontal variant="mine">
            {this.daysOfWeekListGroup(this.props.meals[this.state.currentMealIndex].days)}
          </ListGroup>
        </Container>
        <br />
        <br />
        <Container>
          <div>
            {console.log(this.state.currentMealIndex)}
            {console.log(this.props.recipeInfo)}
            {console.log(this.props.mealInfo)}
            {this.displayRecipes(this.props.recipeInfo)}
          </div>
        </Container>
        <Dialog
          open={this.state.deleteDialogOpen}
          onClose={() => this.setState({
            deleteDialogOpen: false,
            deleteSuccessful: true,
          })}
        >
          <DialogTitle>Delete this meal</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this meal?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDeleteDialogNo}>No</Button>
            <Button color="secondary" onClick={this.handleDeleteDialogYes}>Yes</Button>
          </DialogActions>
        </Dialog>

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
