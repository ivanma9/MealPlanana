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
      addModalVisible: false,
      mealSelected: '',
    };
    this.handleAddMeal = this.handleAddMeal.bind(this);
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

  handleAddMeal() {
    this.addModalRef.current.open();
  }

  handleEditMeal() {

  }

  handleViewMeal(info) {
    info.el.style.borderColor = 'red';
    console.log(info);
    console.log(info.event._def.extendedProps.recipes);
    this.setState({
      mealSelected: info.event._def.title,
    });
    console.log(this.state.mealSelected);
    this.viewModalRef.current.open();
  }

  render() {
    // const { username } = this.props;

    return (
      <div>
        <Modal
          ref={this.addModalRef}
          header={(
            <h3>
              {'  '}
              Add Meal
            </h3>
          )}
          contentStyle={{ width: 500, height: 350 }}
          children={<AddMeal />}
        />
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
          {console.log(this.props.meals)}
        </div>

        <Container className="text-center">
          <style type="text/css">
            {`
          .btn-flat {
            background-color: #ffe135;
            color: black;
          }

          .btn-xxl {
            padding: 1rem 7rem;
            font-size: 1.5rem;
            margin: 5rem;
            border-radius: 10rem;
            border-color: black;
            border-width: 0.5rem;
          }
          `}
          </style>
          <Button variant="flat" size="xxl" onClick={this.handleAddMeal}>
            Add Meal
          </Button>

          {/* <Button className="m-4 p-2" onClick={this.handleChangeViewWeek}>
            Edit Meal
          </Button> */}
        </Container>

        <FullCalendar
          ref={this.calendarRef}
          height={screen.height - 50}
          // aspectRatio={1}
          headerToolbar={{
            center: 'dayGridMonth,dayGridWeek,timeGridFourDay,timeGridDay,listWeek', // buttons for switching between views
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
              buttonText: 'Todo list',
            },
            dayGridMonth: {
              buttonText: 'Month',
            },
            dayGridWeek: {
              buttonText: 'Week',
            },
          }}
          fixedWeekCount={false}
          selectable
          dateClick={(e) => this.changeDate(e)}
          eventClick={(info) => this.handleViewMeal(info)
            // function (info) {
            //   info.jsEvent.preventDefault(); // don't let the browser navigate

            //   alert(`Event: ${info.event.title}`);
            //   this.handleViewMeal();
            //   // change the border color just for fun
            //   info.el.style.borderColor = 'red';
            // }
          }
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
