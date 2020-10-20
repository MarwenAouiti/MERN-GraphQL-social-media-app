import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/auth';

function AuthRoute({ component: Component, ...rest }) {
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...rest} // whatever props are passed from the wrapper component
      render={(props) =>
        user ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  );
}

export default AuthRoute;
