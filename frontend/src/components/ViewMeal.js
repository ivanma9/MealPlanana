import { MdEdit } from 'react-icons/md';
import { BsFillTrashFill } from 'react-icons/bs';
import React, { Component } from 'react';
import { Button, Container } from 'react-bootstrap';

export default class ViewMeal extends Component {
  constructor(props) {
    super(props);

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
    console.log('ko');
  }

  render() {
    return (
      <div style={{ marginTop: 10, fontSize: 12 }}>
        <div>
          <h3>
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
          </h3>
        </div>

        <label>
          Starts:
        </label>
        <br />
        <label>
          Ends:
        </label>
        <div>
          <Button variant="outline-primary" value={0}>Sun</Button>
          <Button variant="outline-primary" value={1}>Mon</Button>
          <Button variant="outline-primary" value={2}>Tue</Button>
          <Button variant="outline-primary" value={3}>Wed</Button>
          <Button variant="outline-primary" value={4}>Thu</Button>
          <Button variant="outline-primary" value={5}>Fri</Button>
          <Button variant="outline-primary" value={6}>Sat</Button>
        </div>
        <br />
      </div>
    );
  }
}
