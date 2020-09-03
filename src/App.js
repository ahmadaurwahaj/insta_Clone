import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
export default function App() {
  const [data, setData] = useState({});

  const access_Token =
    "IGQVJVVU1mS2pTc3g3eWpCTk8wLXpRVXpLSVpWdG1kUVByX2dlX0lONzRoTHMxY24zRGNMOTJoTW5pNms3NGdSMDJCdnREaUtRZA3FnRGZAENmNiSkktMkRjeGJDdmZAmMVlmWVpTMTFUUkxtU0ZAOUlFKQgZDZD";
  useEffect(() => {
    axios
      .get(
        `https://api.instagram.com/v1/users/wahaj_choudhry/followed-by?access_token${access_Token}`
      )
      .then(res => {
        setData(res.data);
      })
      .catch(error => {
        console.log("Error loading data");
      });
  }, []);
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Name - {data.full_name}</h2>
    </div>
  );
}
