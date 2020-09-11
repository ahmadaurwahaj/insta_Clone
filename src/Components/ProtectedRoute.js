import React from "react";
import { Route, Redirect } from "react-router-dom";
import Header from "./LogInScreen/Header/Header";
import Loader from "./LogInScreen/Loader/Loader";
const ProtectedRoute = ({
  component: Component,
  isAuthenticated,
  isVerifying,
  retrieveSuccess,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      isVerifying ? (
        <div />
      ) : isAuthenticated ? (
        <>
          {retrieveSuccess ? (
            <>
              <Header></Header>
              <Component {...props} {...rest} />
            </>
          ) : (
            <Loader />
          )}
        </>
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);
export default ProtectedRoute;
