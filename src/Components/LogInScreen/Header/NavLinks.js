import React, { useState } from "react";
import style from "./Header.module.css";
import { Link } from "react-router-dom";
import { BiUserCircle as Profile } from "react-icons/bi";
import { FaRegBookmark as Save } from "react-icons/fa";
import { FiSettings as Settings } from "react-icons/fi";
import HomeIcon from "./../../../static/img/home.png";
// import Message from "./../../../../static/img/email.png";
// import Explore from "./../../../../static/img/explore.png";
import { logoutUser } from "../../../Redux/Actions/auth";
import { useDispatch } from "react-redux";
import Heart from "./../../../static/img/heart.png";
import HeartFill from "./../../../static/img/heartFill.png";
function NavLinks({ user }) {
  const dispatch = useDispatch();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
  };
  return (
    <ul className={style.listWrapper}>
      <li className={style.singleItem}>
        <Link to="/">
          <img alt="" src={HomeIcon} className={style.icon}></img>
        </Link>
      </li>
      {/* <li className={style.singleItem}>
        <Link to="/inbox">
          <img src={Message} className={style.icon}></img>
        </Link>
      </li>
      <li className={style.singleItem}>
        <Link to="/explore">
          <img src={Explore} className={style.icon}></img>
        </Link>
      </li> */}
      <li className={style.singleItem}>
        <span onClick={e => setShowNotifications(!showNotifications)}>
          {showNotifications ? (
            <img alt="" src={HeartFill} className={style.icon}></img>
          ) : (
            <img alt="" src={Heart} className={style.icon}></img>
          )}
        </span>
      </li>
      <li className={style.singleItem}>
        <span onClick={e => setShowProfile(!showProfile)}>
          <img
            alt=""
            src="https://instagram.flhe3-1.fna.fbcdn.net/v/t51.2885-19/s320x320/82906858_791653004647399_1879646176001654784_n.jpg?_nc_ht=instagram.flhe3-1.fna.fbcdn.net&_nc_ohc=SmNH9bvVA9YAX-RS6QI&oh=35d7846a807075da92e4193652c68e12&oe=5F80D88A"
            className={`${style.icon} ${style.lastIcon}`}
          />
        </span>
        {showProfile && (
          <div className={style.profileDropDown}>
            <ul className={style.profileDropDownMenu}>
              <Link to={`/profile/${user.uid}`} className={style.linkDropDown}>
                <li className={style.profileDropDownli}>
                  <Profile className={style.dropDownIcon} />
                  <span className={style.profileDropDownText}>Profile</span>
                </li>
              </Link>
              <Link
                to={`/profile/${user.uid}/saved`}
                className={style.linkDropDown}
              >
                <li className={style.profileDropDownli}>
                  <Save className={style.dropDownIcon} />
                  <span className={style.profileDropDownText}>Saved</span>
                </li>
              </Link>
              <Link to="/settings" className={style.linkDropDown}>
                <li className={style.profileDropDownli}>
                  <Settings className={style.dropDownIcon} />
                  <span className={style.profileDropDownText}>Settings</span>
                </li>
              </Link>
              <Link to="/" className={`${style.linkDropDown} ${style.logOut}`}>
                <li
                  className={`${style.profileDropDownli} ${style.logOut}`}
                  onClick={handleLogout}
                >
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
