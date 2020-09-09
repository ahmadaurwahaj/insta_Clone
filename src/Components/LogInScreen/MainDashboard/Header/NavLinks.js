import React, { useState } from "react";
import style from "./Header.module.css";
import { Link } from "react-router-dom";
import { AiFillHome as Home } from "react-icons/ai";
import {
  BiMessageSquare as Message,
  BiUserCircle as Profile,
} from "react-icons/bi";
import {
  FaWpexplorer as Explorer,
  FaRegBookmark as Save,
} from "react-icons/fa";
import { BsHeart as Heart } from "react-icons/bs";
import { FiSettings as Settings } from "react-icons/fi";
function NavLinks() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <ul className={style.listWrapper}>
      <li className={style.singleItem}>
        <Link to="/">
          <Home className={style.icon} />
        </Link>
      </li>
      <li className={style.singleItem}>
        <Link to="/inbox">
          <Message className={style.icon} />
        </Link>
      </li>
      <li className={style.singleItem}>
        <Link to="/explore">
          <Explorer className={style.icon} />
        </Link>
      </li>
      <li className={style.singleItem}>
        <span>
          <Heart
            className={style.icon}
            onClick={e => setShowNotifications(!showNotifications)}
          />
        </span>
      </li>
      <li className={style.singleItem}>
        <span>
          <Profile
            className={`${style.icon} ${style.lastIcon}`}
            onClick={e => setShowProfile(!showProfile)}
          />
        </span>
        {showProfile && (
          <div className={style.profileDropDown}>
            <ul className={style.profileDropDownMenu}>
              <Link to="/" className={style.linkDropDown}>
                <li className={style.profileDropDownli}>
                  <Profile className={style.dropDownIcon} />
                  <span className={style.profileDropDownText}>Profile</span>
                </li>
              </Link>
              <Link to="/" className={style.linkDropDown}>
                <li className={style.profileDropDownli}>
                  <Save className={style.dropDownIcon} />
                  <span className={style.profileDropDownText}>Saved</span>
                </li>
              </Link>
              <Link to="/" className={style.linkDropDown}>
                <li className={style.profileDropDownli}>
                  <Settings className={style.dropDownIcon} />
                  <span className={style.profileDropDownText}>Settings</span>
                </li>
              </Link>
              <Link to="/" className={`${style.linkDropDown} ${style.logOut}`}>
                <li className={`${style.profileDropDownli} ${style.logOut}`}>
                  Logout
                </li>
              </Link>
            </ul>
          </div>
        )}
      </li>
    </ul>
  );
}

export default NavLinks;
