import React, { useState } from "react";
import style from "./Header.module.css";

import { withRouter } from "react-router";

function Search({ history }) {
  const [search, setSearch] = useState("");
  const [isOk, setIsOk] = useState(false);
  const handleSubmit = e => {
    e.preventDefault();

    if (search !== "") {
      history.push(`/search/${search}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search"
        onChange={e => setSearch(e.target.value)}
        value={search}
        className={style.searchInp}
      />
    </form>
  );
}

export default withRouter(Search);
