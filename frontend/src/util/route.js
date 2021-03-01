import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

const mapStateToProps = ({ session: { userId } }) => ({
  loggedIn: Boolean(userId),
});

const Auth = ({ loggedIn, path, component: Component }) => (
  <Route
    path={path}
    render={(props) => (
      loggedIn ? <Redirect to="/dashboard" /> : <Component {...props} />
    )}
  />
);

Auth.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired,
  component: PropTypes.elementType.isRequired,
};

const Protected = ({
  loggedIn, path, component: Component, ...rest
}) => (
  <Route
    path={path}
    {...rest}
    render={(props) => (
      loggedIn ? <Component {...props} /> : <Redirect to="/login" />
    )}
  />
);

Protected.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired,
  component: PropTypes.elementType.isRequired,
};

const Conditional = ({ loggedIn, path }) => (
  <Route
    path={path}
    render={() => (
      loggedIn ? <Redirect to="/dashboard" /> : <Redirect to="/login" />
    )}
  />
);

Conditional.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired,
};

export const AuthRoute = withRouter(
  connect(mapStateToProps)(Auth),
);

export const ProtectedRoute = withRouter(
  connect(mapStateToProps)(Protected),
);

export const ConditionalRoute = withRouter(
  connect(mapStateToProps)(Conditional),
);
