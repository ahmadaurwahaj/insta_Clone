import React from "react";
import style from "./Profile.module.css";
import { Link } from "react-router-dom";
function ProfileMediaHeader() {
  return (
    <div className={style.headerNavLinks}>
      <Link to="/profile/" className={style.activeLink}>
        POSTS
      </Link>
      <Link to="/profile/saved">SAVED</Link>
    </div>
  );
}

export default ProfileMediaHeader;
