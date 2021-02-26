import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { logout } from '../actions/session';
import 'bootstrap/dist/css/bootstrap.min.css';

import CalendarView from './CalendarView';

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
        <div className="container-fluid bg-dark text-white w-100 p-2 mb-5">
          <h1 className="text-center p-5">
            Hi fi
            {session.username}
          </h1>
        </div>

        <div className="container">
          <Route path="/dashboard" exact component={CalendarView} />
        </div>

      </div>
    </Router>

  </>
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard);
