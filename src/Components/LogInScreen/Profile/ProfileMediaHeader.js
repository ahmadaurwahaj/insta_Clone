import React from "react";
import style from "./Profile.module.css";
import { Link } from "react-router-dom";
function ProfileMediaHeader({ isExact }) {
  return (
    <div className={style.headerNavLinks}>
      <Link
        to="/profile/"
        className={`${isExact === true && style.activeLink}`}
      >
        POSTS
      </Link>
      <Link
        to="/profile/saved"
        className={`${isExact === false && style.activeLink}`}
      >
        SAVED
      </Link>
    </div>
  );
}

export default ProfileMediaHeader;
