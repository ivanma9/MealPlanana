import React, { Component } from 'react';

import { Button } from 'react-bootstrap';
import { GiBananaBunch } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { logout } from '../actions/session';

const mapStateToProps = ({ session }) => ({
  session,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
});

function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg"
    >
      <Link
        to="/dashboard"
        className="navbar-brand"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Typography
          variant="button"
          style={{
            fontSize: 30,
            paddingRight: '0.2em',
          }}
        >
          Meal Planana

        </Typography>
        <GiBananaBunch color="#edc80c" size="2em" />
      </Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li
            className="navbar-item"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Link to="/recipes" className="nav-link">
              <Typography
                variant="button"
                style={{
                  fontSize: 25,
                }}
              >
                Recipes

              </Typography>
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li
            className="navbar-item"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Button className="mr-2 p-2" onClick={logout} style={{ backgroundColor: 'darkolivegreen' }}>
              Logout
            </Button>
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
