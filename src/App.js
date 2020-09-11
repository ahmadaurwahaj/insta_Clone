import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import ProtectedRoute from "./Components/ProtectedRoute";
import Home from "./Components/LogInScreen/HomeDefaultDisplay";
import Login from "./Components/LogOutScreen/SignIn/SignIn";
import SignUp from "./Components/LogOutScreen/SignUp/Signup";
import Settings from "./Components/LogInScreen/Settings/Settings";
import Posts from "./Components/LogInScreen/MainDashboard/NewsFeed/Posts";
import { useSelector, useDispatch } from "react-redux";
import "./App.css";
import { getCurrentUserData } from "./Redux/Actions/auth";
function App(props) {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  const { isAuthenticated, isVerifying } = props;
  const userData = useSelector(state => state.auth.userData);
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCurrentUserData(user));
    }
    // return () => {
    //   unsub();
    // };
  }, [dispatch, isAuthenticated, user]);

  return (
    <Switch>
      <ProtectedRoute
        exact
        path="/"
        component={Home}
        ChildComponent={Posts}
        isAuthenticated={isAuthenticated}
        isVerifying={isVerifying}
        user={userData}
      />
      <ProtectedRoute
        exact
        path="/settings"
        component={Settings}
        isAuthenticated={isAuthenticated}
        isVerifying={isVerifying}
        user={userData}
      />
      <Route path="/login" component={Login} exact />
      <Route path="/signup" component={SignUp} exact />
    </Switch>
  );
}
function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying,
  };
}

export default connect(mapStateToProps, null)(App);
