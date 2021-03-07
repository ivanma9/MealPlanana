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
import { GiMeal } from 'react-icons/gi';
import { connect } from 'react-redux';
import Modal from './modal/stdModal.component';
import AddMeal from './AddMeal/add-meal.component';
import ViewMeal from './ViewMeal';

import { parseMeals } from './helpers/calendarHelper';

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

  handleEditMeal() {

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

  searchRecipeID(recipeID) {
    let recipe;
    for (recipe in (this.props.recipes)) {
      console.log(recipeID + " : " + this.props.recipes[recipe]._id);
      if (recipeID === this.props.recipes[recipe]._id) {
        return this.props.recipes.[recipe];
      }
    }
    return "Not Found";
  }

  render() {
    // const { username } = this.props;

    return (
      <div>
        <Modal
          ref={this.viewModalRef}
          headerDisabled
          contentStyle={{ width: 500, height: 350 }}
          children={<ViewMeal header={this.state.mealSelected} recipeInfo={this.searchRecipeID(this.state.recipeInMeal)} />}
        />

        <h2 className="text-center">
          {this.props.username}
          {' '}
          Monkeys Schedule 🙉
        </h2>

        <div>
          {console.log(parseMeals(this.props.meals))}
        </div>

        <div>
          {console.log(this.props.meals)}
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
          <Link to="/recipes">
            <Button variant="flat" size="xxl">
              Add Meal
            </Button>
          </Link>

          {/* <Button className="m-4 p-2" onClick={this.handleChangeViewWeek}>
            Edit Meal
          </Button> */}
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
)(CalendarView);
