import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';
import { Button, Container } from 'react-bootstrap';
import moment from 'moment';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { GiMeal } from 'react-icons/gi';
import { connect } from 'react-redux';
import Modal from './modal/stdModal.component';
import AddMeal from './AddMeal/add-meal.component';
import ViewMeal from './ViewMeal';

import { parseMeals } from './helpers/calendarHelper';
import { updateMeals } from '../actions/session';

// import axios from 'axios';

// import "@fullcalendar/core/main.css";
// import "@fullcalendar/daygrid/main.css";
// import "@fullcalendar/timegrid/main.css";

class CalendarView extends Component {
  calendarRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      dateState: new Date(), // Can just Use state in Component
      mealSelected: '',
      recipeInMeal: '',
      deletedRecipes: [],
      deletePressed: false,
    };
    // this.handleEditMeal = this.handleEditMeal.bind(this);
    // this.handleChangeView4Day = this.handleChangeView4Day.bind(this);
    // this.handleChangeViewDay = this.handleChangeViewDay.bind(this);
  }

  addModalRef = React.createRef();

  viewModalRef = React.createRef();

  changeDate(e) {
    console.log(e);
    this.setState({ dateState: e });
  }

  handleViewMeal(info) {
    info.el.style.borderColor = 'red';
    console.log(info);
    console.log(info.event._def.extendedProps.recipes);
    this.setState({
      mealSelected: info.event._def.title,
      recipeInMeal: info.event._def.extendedProps.recipes,
    });
    console.log(this.state.mealSelected);
    this.viewModalRef.current.open();
  }

  searchMeal(mealTitle) {
    for (const meal of this.props.meals) {
      if (meal.title == mealTitle) {
        return meal;
      }
    }
    return 'Not Found';
  }

  searchRecipeID(recipeIDs) {
    let recipe;
    const array = [];
    for (const recipeID of recipeIDs) {
      let found = false;
      for (recipe in (this.props.recipes)) {
        if (recipeID === this.props.recipes[recipe]._id) {
          console.log('Found');
          array.push(this.props.recipes[recipe]);
          found = true;
        }
      }
      if (!found) {
        console.log(`${recipeID} not found`);
        this.state.deletedRecipes.push(recipeID);
      }
    }
    return array;
  }

  handleCallback = (childData) => {
    this.setState({ deletePressed: childData });
  }

  render() {
    // const { username } = this.props;

    return (
      <div>
        <Modal
          ref={this.viewModalRef}
          headerDisabled
          contentStyle={{ width: 600, height: 500 }}
          children={(
            <ViewMeal
              header={this.state.mealSelected}
              mealInfo={this.searchMeal(this.state.mealSelected)}
              recipeInfo={this.searchRecipeID(this.state.recipeInMeal)}
              deletedRecipes={this.state.deletedRecipes}
              parentCallback={this.handleCallback}
            />
)}
        />

        <h2 className="text-center">
          {this.props.username}
          {' '}
          Monkeys Schedule 🙉
        </h2>

        <div>
          {console.log(parseMeals(this.props.meals))}
        </div>

        <Container className="text-center">
          <style type="text/css">
            {`
          .btn-flat {
            color: black;
          }

          .btn-xxl {
            background-color: #ffe135;
            padding: 1rem 7rem;
            font-size: 1.5rem;
            margin: 5rem;
            border-radius: 10rem;
            border-color: black;
            border-width: 0.5rem;
          }
          `}
          </style>
          <br />

        </Container>

        <FullCalendar
          ref={this.calendarRef}
          height={screen.height - 50}
          // aspectRatio={1}
          headerToolbar={{
            center: 'dayGridMonth,dayGridWeek,timeGridFourDay,timeGridDay,listWeek, listDay', // buttons for switching between views
          }}
          plugins={[rrulePlugin, dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
          initialView="timeGridDay"
          timeZone="local"
          events={parseMeals(this.props.meals)}
          views={{
            timeGridFourDay: {
              type: 'timeGrid',
              duration: { days: 4 },
              buttonText: '4 Day',
            },
            timeGridDay: {
              buttonText: 'Day',
            },
            listWeek: {
              buttonText: 'Meals of the Week',
            },
            dayGridMonth: {
              buttonText: 'Month',
            },
            dayGridWeek: {
              buttonText: 'Week',
            },
            listDay: {
              buttonText: 'Today\'s Meals',
            },
          }}
          fixedWeekCount={false}
          selectable
          dateClick={(e) => this.changeDate(e)}
          eventClick={(info) => this.handleViewMeal(info)}
        />

        <p>
          Current selected date is
          {' '}
          <b>{moment(this.state.dateState.dateStr).format('MMMM Do YYYY')}</b>
        </p>
        <Snackbar
          autoHideDuration={3000}
          open={this.state.deletePressed}
          onEnter={()=> this.viewModalRef.current.close()}
          onClose={() => this.setState({ deletePressed: false })}
        >
          <MuiAlert elevation={6} variant="filled" severity="error" onClose={() => { this.setState({ deletePressed: false }); }}> Meal successfully Deleted! </MuiAlert>
        </Snackbar>

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  username: state.session.username,
  meals: state.session.meals,
  recipes: state.recipes.items,
});

export default connect(
  mapStateToProps,
  { updateMeals },
)(CalendarView);
