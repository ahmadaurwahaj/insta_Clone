import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import ProtectedRoute from "./Components/ProtectedRoute";
import Home from "./Components/LogInScreen/HomeDefaultDisplay";
import Login from "./Components/LogOutScreen/SignIn/SignIn";
import SignUp from "./Components/LogOutScreen/SignUp/Signup";
import Settings from "./Components/LogInScreen/Settings/Settings";
import Posts from "./Components/LogInScreen/MainDashboard/NewsFeed/Posts";
import ProfileSetup from "./Components/LogOutScreen/SignUp/SignUpSetup";
import Profile from "./Components/LogInScreen/Profile/Profile";
import SpecificPost from "./Components/LogInScreen/SpecificPost/SpecificPost";
import { useSelector, useDispatch } from "react-redux";
import "./App.css";
import { getCurrentUserData } from "./Redux/Actions/auth";

function App(props) {
  const user = useSelector(state => state.auth.user);
  const retrieveSuccess = useSelector(state => state.auth.retrieveSuccess);
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
        retrieveSuccess={retrieveSuccess}
        user={userData}
        isNewUser={userData}
      />
      <ProtectedRoute
        exact
        path="/settings"
        component={Settings}
        isAuthenticated={isAuthenticated}
        isVerifying={isVerifying}
        user={userData}
        retrieveSuccess={retrieveSuccess}
        isNewUser={userData}
      />
      <ProtectedRoute
        path="/profile"
        component={Profile}
        isAuthenticated={isAuthenticated}
        isVerifying={isVerifying}
        user={userData}
        retrieveSuccess={retrieveSuccess}
        isNewUser={userData}
      />
      <ProtectedRoute
        path="/p/:docId"
        exact
        component={SpecificPost}
        isAuthenticated={isAuthenticated}
        isVerifying={isVerifying}
        user={userData}
        retrieveSuccess={retrieveSuccess}
        isNewUser={userData}
      />
      <Route path="/login" component={Login} exact />
      <Route path="/signup" component={SignUp} exact />
      <Route path="/profileSetup" component={ProfileSetup} exact />
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
