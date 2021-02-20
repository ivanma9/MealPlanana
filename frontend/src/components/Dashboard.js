import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { logout } from '../actions/session';
import 'bootstrap/dist/css/bootstrap.min.css';

import CalendarMonthView from './CalendarView';

const mapStateToProps = ({ session }) => ({
  session,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
});

const Dashboard = ({ logout, session }) => (
  <>
    <Router>
      <div className="w-100">
        <nav className="navbar navbar-expand-lg navbar-light bg">
          <a
            className="navbar-brand"
            href="https://codingthesmartway.com"
            target="_blank"
          />
          <Link to="/dashboard" className="navbar-brand">
            Meal Planana
          </Link>
          <div className="collpase navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="navbar-item">
                <Link to="/" className="nav-link">
                  Recipes
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/create" className="nav-link">
                  Create Recipe
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
              <li className="navbar-item">
                <button className="rounded-pill p-1 px-3" onClick={logout}>Logout</button>
              </li>
            </ul>

          </div>
        </nav>
        <div className="container-fluid bg-dark text-white w-100 p-2 mb-5">
          <h1 className="text-center p-5">
            Hi fi
            {session.username}
          </h1>
        </div>

        <div className="container">
          <Route path="/dashboard" exact component={CalendarMonthView} />
        </div>

      </div>
    </Router>


  </>
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard);
