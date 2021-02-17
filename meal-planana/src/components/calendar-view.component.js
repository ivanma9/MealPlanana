import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import {Button, Container} from 'react-bootstrap'
import moment from 'moment';

import axios from 'axios';

// import "@fullcalendar/core/main.css";
// import "@fullcalendar/daygrid/main.css";
// import "@fullcalendar/timegrid/main.css";


// const Recipe = (props) => (
//   <tr>
//     <td className={props.recipe.recipe_description ? 'completed' : ''}>
//       {props.recipe.recipe_description}
//     </td>
//     <td className={props.recipe.recipe_description ? 'completed' : ''}>
//       {props.recipe.recipe_responsible}
//     </td>
//     <td className={props.recipe.recipe_description ? 'completed' : ''}>
//       {props.recipe.recipe_priority}
//     </td>
//     <td>
//       <Link to={`/editMeal/${props.recipe._id}`}>Edit Meal</Link>
//     </td>
//   </tr>
// );


export default class CalendarMonthView extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      meals: [
        { 
          title: 'Snack on Bananas', 
          date: '2021-02-01' ,
          startTime: '14:30:00',
          endTime: '16:00:00',
          daysOfWeek: ['2', '5']
        },
        { 
          groupID: 'smoothieEvents',
          daysOfWeek: ['4'],
          title: 'drink nana smoothie', 
          date: '2021-02-02' ,
          color: "red",
          startTime: '9:30:00',
          endTime: '10:00:00'
        },
        { 
          title: 'fresh plantana', 
          date: '2021-02-06' 
        },
        { 
          title: 'moonki meeting meal', 
          date: '2021-02-16' 
        }
      ],
      dateState: new Date(), // Can just Use state in Component
      viewState: "dayGridMonth",
    };
    this.handleChangeViewMonth = this.handleChangeViewMonth.bind(this);
    this.handleChangeViewWeek = this.handleChangeViewWeek.bind(this);
    this.handleChangeView4Day = this.handleChangeView4Day.bind(this);
    this.handleChangeViewDay = this.handleChangeViewDay.bind(this);


  }

  calendarRef = React.createRef();

  componentDidMount() {
    axios
      .get('http://localhost:4000/users/:id/meals/')
      .then((response) => {
        this.setState({ meals: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidUpdate() {
    axios
      .get('http://localhost:4000/user/:id/meals/')
      .then((response) => {
        this.setState({ meals: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }


  changeDate(e){
    console.log(e);
    this.setState({ dateState: e})
  }

  renderEventContent (eventInfo) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    )
  }

  handleChangeViewMonth(){ 
    let calendarApi = this.calendarRef.current.getApi();
    calendarApi.changeView("dayGridMonth");
    console.log(calendarApi);
   }
   handleChangeViewWeek(){ 
    let calendarApi = this.calendarRef.current.getApi();
    calendarApi.changeView("dayGridWeek");
    console.log(calendarApi);
   }
   handleChangeView4Day(){ 
    let calendarApi = this.calendarRef.current.getApi();
    calendarApi.changeView("timeGridFourDay");
    console.log(calendarApi);
   }
   handleChangeViewDay(){ 
    let calendarApi = this.calendarRef.current.getApi();
    calendarApi.changeView("timeGridDay");
    console.log(calendarApi);
   }


  render() {
    return (
      <div>
        <h3>Monkeys Schedule 🙉</h3>
        <Container className ="text-center">
          <Button className = "mr-4 p-2" onClick={this.handleChangeViewMonth}>
            Month View
          </Button>
          <Button className = "m-4 p-2" onClick={this.handleChangeViewWeek}>
            Week View
          </Button>
          <Button className = "m-4 p-2" onClick={this.handleChangeView4Day}>
            4 Day View
          </Button>
          <Button className = "m-4 p-2" onClick={this.handleChangeViewDay}>
            Day View
          </Button>
        </Container>
        


        <FullCalendar
          ref={this.calendarRef}
          plugins={[ dayGridPlugin, interactionPlugin, timeGridPlugin ]}
          initialView="timeGridFourDay"
          events={this.state.meals}
          views={{
            timeGridFourDay: {
              type: 'timeGrid',
              duration: { days: 4 },
              buttonText: '4 day'
            },
            timeGridDay: {

            }
          }}
          fixedWeekCount={false}
          dateClick={(e) => this.changeDate(e)}
          eventContent={this.renderEventContent}
        />

        <p>Current selected date is <b>{moment(this.state.dateState.dateStr).format('MMMM Do YYYY')}</b></p>
        
        {/* <table
          className="table table-striped"
          style={{ marginTop: 20 }}
        >
          <thead>
            <tr>
              <th>Yoooo</th>
              <th>Responsible</th>
              <th>Priority</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{this.recipeList()}</tbody>
        </table> */}
      </div>
    );
  }
}
