import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { GiBananaBunch } from 'react-icons/gi';
import { logout } from '../actions/session';

const mapStateToProps = ({ session }) => ({
  session,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
});

function Navbar() {
  return (
  // TODO: center Recipes
    <nav className="navbar navbar-expand-lg navbar-light bg">
      <Link to="/dashboard" className="navbar-brand">
        Meal Planana
      </Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
            <Link to="/dashboard" className="nav-link">
              <GiBananaBunch color="#edc80c" size="2.3em" />
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/recipes" className="nav-link">
              Recipes
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
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Navbar);
