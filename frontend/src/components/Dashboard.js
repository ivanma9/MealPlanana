import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { logout } from '../actions/session';
import 'bootstrap/dist/css/bootstrap.min.css';

import CalendarView from './CalendarView';
import AddMeal from './AddMeal/add-meal.component';
import { fetchRecipes } from '../actions/recipes';

const mapStateToProps = ({ session, recipes }) => ({
  session,
  recipes: recipes.items,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
  fetchRecipes: () => dispatch(fetchRecipes()),
});

const Dashboard = ({
  session, recipes, logout, fetchRecipes,
}) => {
  useEffect(() => {
    if (recipes.length === 0) {
      fetchRecipes();
    }
  }, [recipes]);
  return (
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
            <Route exact path="/dashboard" component={CalendarView} />
            <Route path="/addMeal" component={AddMeal} />
          </div>
        </div>
      </Router>
    </>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard);
