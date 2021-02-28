import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';
import { Button, Container } from 'react-bootstrap';
import moment from 'moment';

import { connect } from 'react-redux';
import { parseMeals, jsony } from './helpers/calendarHelper';

// import axios from 'axios';

// import "@fullcalendar/core/main.css";
// import "@fullcalendar/daygrid/main.css";
// import "@fullcalendar/timegrid/main.css";

const Meal = (props) => (
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
      <Link to={`/editMeal/${props.recipe._id}`}>Edit Meal</Link>
    </td>
  </tr>
);

class CalendarView extends Component {
  calendarRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
	    //   meals: [
	    //     {
	    //       title: 'Snack on Bananas',
	    //       date: '2021-02-01',
	    //       startTime: '14:30:00',
	    //       endTime: '16:00:00',
	    //       daysOfWeek: ['2', '5'],
	    //     },
	    //     {
	    //       groupID: 'smoothieEvents',
	    //       daysOfWeek: ['4'],
	    //       title: 'drink nana smoothie',
	    //       date: '2021-02-02',
	    //       color: 'red',
	    //       startTime: '9:30:00',
	    //       endTime: '10:00:00',
	    //     },
	    //     {
	    //       title: 'fresh plantana',
	    //       date: '2021-02-06',
	    //     },
	    //     {
	    //       title: 'moonki meeting meal',
	    //       date: '2021-02-16',
	    //     },
	    //     {
	    //       groupId: 'blueEvents', // recurrent events in this group move together
	    //       daysOfWeek: ['4'],
	    //       startTime: '10:45:00',
	    //       endTime: '12:45:00',
	    //     },
	    //     {
	    //       daysOfWeek: ['3'], // these recurrent events move separately
	    //       startTime: '11:00:00',
	    //       endTime: '11:30:00',
	    //       color: 'red',
	    //     },
	    //     {
	    //       title: 'rrule event bananamamam',
	    //       rrule: {
	    //         dtstart: '2021-02-11T13:00:00',
	    //         freq: 'weekly',
	    //       },
	    //       duration: '02:00',
	    //     },
	    //   ],
      dateState: new Date(), // Can just Use state in Component
    };
    this.handleAddMeal = this.handleAddMeal.bind(this);
    this.handleEditMeal = this.handleEditMeal.bind(this);
    // this.handleChangeView4Day = this.handleChangeView4Day.bind(this);
    // this.handleChangeViewDay = this.handleChangeViewDay.bind(this);
  }

  changeDate(e) {
    console.log(e);
    this.setState({ dateState: e });
  }

  handleAddMeal(){

  }
  
  handleEditMeal(){

  }

  render() {
    // const { username } = this.props;

    return (
      <div>
        <h2 className="text-center">
          NANA
          {' '}
          {this.props.username}
          {' '}
          Monkeys Schedule 🙉
        </h2>

        <div>
          {console.log(parseMeals(this.props.meals))}
        </div>
        <div>
          {jsony(this.props.meals)}
        </div>
        <div>
          {console.log(this.props.meals)}
        </div>


        <Container className="text-center">
          <Button className="mr-4 p-2" onClick={this.handleChangeViewMonth}>
            Add Meal
          </Button>
          <Button className="m-4 p-2" onClick={this.handleChangeViewWeek}>
            Edit Meal
          </Button>
        </Container>

        <FullCalendar
          ref={this.calendarRef}
          headerToolbar={{
            center: 'dayGridMonth,dayGridWeek,timeGridFourDay,timeGridDay', // buttons for switching between views
          }}
          plugins={[rrulePlugin, dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="timeGridDay"
          events={parseMeals(this.props.meals)}
          views={{
            timeGridFourDay: {
              type: 'timeGrid',
              duration: { days: 4 },
              buttonText: '4 day',
            },
            timeGridDay: {

            },
          }}
          fixedWeekCount={false}
          dateClick={(e) => this.changeDate(e)}
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
});

export default connect(
  mapStateToProps,
)(CalendarView);
