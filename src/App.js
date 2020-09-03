import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
export default function App() {
  const [following, setFollowing] = useState({});

  useEffect(() => {
    console.log("Error");
    axios
      .get("https://api.instagram.com/v1/users/wahaj_choudhry/followed-by")
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.log("Error loading data");
      });
  }, []);
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
