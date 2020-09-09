import React, { useEffect, useState } from "react";
import "./App.css";
import SignIn from "./Components/LogOutScreen/SignIn/SignIn";
import SignUp from "./Components/LogOutScreen/SignUp/Signup";
import Home from "./Components/LogInScreen/MainDashboard/HomeDefaultDisplay";
import Profile from "./Components/LogInScreen/Profile/Profile";
import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";
export default function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <SignIn path="/" exact />
          <Route path="/signup" exact>
            <SignUp />
          </Route>
          <Route path="/home" exact>
            <Home />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
