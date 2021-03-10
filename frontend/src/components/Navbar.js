import React, { Component } from 'react';

import { Button, Navbar, Nav } from 'react-bootstrap';
import { GiBananaBunch } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { logout as lg } from '../actions/session';

const mapStateToProps = ({ session }) => ({
  session,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(lg()),
});

function NavBar({ logout }) {
  return (
    <Navbar expand="lg">
      <Navbar.Brand>
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
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Nav className="mr-auto">
          <Nav.Link>
            <Link to="/dashboard" className="nav-link">
              <Typography
                variant="button"
                style={{
                  fontSize: 25,
                }}
              >
                Dashboard
              </Typography>
            </Link>
          </Nav.Link>
          <Nav.Link>
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
          </Nav.Link>
          <Nav.Link>
            <Link to="/recipes/my-recipes" className="nav-link">
              <Typography
                variant="button"
                style={{
                  fontSize: 25,
                }}
              >
                My Recipes
              </Typography>
            </Link>
          </Nav.Link>
        </Nav>
        <div
          className="navbar-item"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Button className="mr-2 p-2" onClick={logout} style={{ backgroundColor: 'darkolivegreen' }}>
            Logout
          </Button>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavBar);
