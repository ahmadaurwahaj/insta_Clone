import React, { useState } from "react";
import style from "./Header.module.css";
function Search() {
  const [search, setSearch] = useState("");
  return (
    <form>
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

export default Search;
