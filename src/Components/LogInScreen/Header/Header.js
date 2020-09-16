import React from "react"; // { useState, useEffect }
import style from "./Header.module.css";
import NavLinks from "./NavLinks";
import Search from "./Search";
import logo from "../../../static/img/instaLogo.png";
import { useSelector } from "react-redux";
// import { db } from "../../../Firebase/firebase";
function Header({ history }) {
  const userData = useSelector(state => state.auth.userData);
  return (
    <div className={style.headerMainWrapper}>
      <div className={style.headerInnerWrapper}>
        <div className={style.imgDiv}>
          <img alt="logo" src={logo} className={style.logoImg} />
        </div>
        <div className={style.searchDiv}>
          <Search />
        </div>
        <div className={style.navLinks}>
          <NavLinks user={userData} />
        </div>
      </div>
    </div>
  );
}

export default Header;
