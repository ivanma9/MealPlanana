import React, { Component } from 'react';

import { Button, Navbar, Nav } from 'react-bootstrap';
import { GiBananaBunch } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { logout as lg } from '../actions/session';
import BananaBunch from '../assets/bananas.svg';
import BananaBunchBlackOutline from '../assets/bananas-blackoutline.svg';

const mapStateToProps = ({ session }) => ({
  session,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(lg()),
});

function NavBar({ logout }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '5em' }}>
      <Navbar.Brand
        className="bg-dark"
        style={{
          paddingRight: '1em', paddingLeft: '1em', marginRight: '-0.5em',
        }}
      >
        <Link
          to="/dashboard"
          className="navbar-brand"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '0.4em',
          }}
        >
          <Typography
            variant="button"
            style={{
              fontSize: 30,
              paddingRight: '0.2em',
              paddingLeft: '0.5em',
              color: 'white',
            }}
          >
            Meal Planana
          </Typography>
          <img src={BananaBunch} alt="Logo" style={{ width: '2em' }} />
          {/* <img src={BananaBunchBlackOutline} alt="Logo" style={{ width: '2em' }} /> */}
        </Link>
      </Navbar.Brand>
      <Navbar expand="lg">
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav>
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
            className="navbar-item ml-auto"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Button className="mr-2 p-2" onClick={logout} style={{ backgroundColor: '#709255' }}>
              Logout
            </Button>
          </div>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavBar);
