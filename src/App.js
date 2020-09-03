import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
function App() {
  const [media, setMedia] = useState({});
  const access_token =
    "IGQVJYRlpWemRfclRZAbjV1UmZAXZAnZA4YnlJblJBVXhRMjhkenV6MTNsSXkxUE01dllpeWI3cmJOSWxOMHRZAZAk1raGcyUHdZAeG94dS11WmlVYWg3M3F2UkNlZA1hQMGluUXY1c3hSOUFINTlXTExZAOUE4aQZDZD";

  useEffect(() => {
    axios
      .get(
        ` https://api.instagram.com/v1/users/wahaj_choudhry?access_token=${access_token}`
      )
      .then(res => {
        console.log("success");
      })
      .catch(error => {
        console.log("Error loading data");
      });
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
