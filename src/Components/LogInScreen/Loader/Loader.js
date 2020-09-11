import React from "react";
import instaLoader from "../../../static/img/instaLoader.gif";
import style from "./Loader.module.css";
function Loader() {
  return (
    <div className={style.fullBodyContainer}>
      <img src={instaLoader} alt="" width="64px" height="64px" />
    </div>
  );
}

export default Loader;
