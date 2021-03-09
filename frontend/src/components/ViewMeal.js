import { MdEdit } from 'react-icons/md';
import { BsFillTrashFill } from 'react-icons/bs';
import React, { Component } from 'react';
import { Button, ListGroup, Container } from 'react-bootstrap';
import ReactHtmlParser from 'react-html-parser';

export default class ViewMeal extends Component {
  constructor(props) {
    super(props);
    this.mealInfo = {};
    this.recipeInfo = {};
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

  daysOfWeek() {
    // TODO daysOfweek Move LISTGROUP
  }

  render() {
    this.daysOfWeek();
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
          <label>
            Starts:
            {' '}
            { this.props.mealInfo.start_date.slice(11, -5)}
          </label>
          <br />
          <label>
            Ends:
            {' '}
            {new Date(Date.parse(this.props.mealInfo.end_date)
            + (this.props.mealInfo.duration * 60 * 1000)).toISOString().slice(11, -5)}
          </label>
          <ListGroup horizontal>
            <ListGroup.Item variant="flat" id="sun">Sun</ListGroup.Item>
            <ListGroup.Item variant="flat" id="mon">Mon</ListGroup.Item>
            <ListGroup.Item variant="flat" id="tue">Tue</ListGroup.Item>
            <ListGroup.Item variant="flat" id="wed">Wed</ListGroup.Item>
            <ListGroup.Item variant="flat" id="thu">Thu</ListGroup.Item>
            <ListGroup.Item variant="flat" id="fri">Fri</ListGroup.Item>
            <ListGroup.Item variant="flat" id="sat">Sat</ListGroup.Item>
          </ListGroup>
        </Container>

        <br />
        <Container>
          <h2>
            {this.props.recipeInfo.title}
          </h2>
          <Container>
            <p>
              {ReactHtmlParser(this.props.recipeInfo.description)}
            </p>
          </Container>

        </Container>

      </div>
    );
  }
}
