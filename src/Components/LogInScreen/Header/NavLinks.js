import React from "react";
import style from "./Header.module.css";
import { Link } from "react-router-dom";
import { BiUserCircle as Profile } from "react-icons/bi";
import { FaRegBookmark as Save } from "react-icons/fa";
import { FiSettings as Settings } from "react-icons/fi";
import HomeIcon from "./../../../static/img/home.png";
import { logoutUser } from "../../../Redux/Actions/auth";
import { useDispatch } from "react-redux";
import Heart from "./../../../static/img/heart.png";
import HeartFill from "./../../../static/img/heartFill.png";
// import Message from "./../../../../static/img/email.png";
// import Explore from "./../../../../static/img/explore.png";
import { Menu } from "@material-ui/core";
import Fade from "@material-ui/core/Fade";
function NavLinks({ user }) {
  const dispatch = useDispatch();
  // console.log(user);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openNotif = Boolean(anchorEl);
  const [anchorProfile, setAnchorProfile] = React.useState(null);
  const openProfile = Boolean(anchorProfile);

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
        <span>
          {openNotif ? (
            <img
              alt=""
              src={HeartFill}
              className={style.icon}
              onClick={() => {
                setAnchorEl(null);
              }}
            ></img>
          ) : (
            <img
              alt=""
              src={Heart}
              className={style.icon}
              onClick={event => {
                setAnchorEl(event.currentTarget);
              }}
            ></img>
          )}
        </span>

        <Menu
          id="fade-menu"
          anchorEl={anchorEl}
          keepMounted
          open={openNotif}
          onClose={() => {
            setAnchorEl(null);
          }}
          TransitionComponent={Fade}
          className={style.notifWrapper}
        >
          <ul className={style.dropDownNotif}>
            {user.notifications.length > 0 ? (
              <>
                {user.notifications.map((data, index) => (
                  <Link
                    key={index}
                    to={data.redirectUrl}
                    className={style.singleNotif}
                    onClick={() => {
                      setAnchorEl(null);
                    }}
                  >
                    <li className={style.innerSingleNotif}>{data.message}</li>
                  </Link>
                ))}
              </>
            ) : (
              <h1 className={style.noNotif}>No Notification</h1>
            )}
          </ul>
        </Menu>
      </li>
      <li className={style.singleItem}>
        <span>
          <img
            alt=""
            src={user.personalData.profilePicUrl}
            className={`${style.icon} ${style.lastIcon}`}
            onClick={event => {
              setAnchorProfile(event.currentTarget);
            }}
          />
        </span>
        <Menu
          id="fade-menu"
          anchorEl={anchorProfile}
          keepMounted={false}
          open={openProfile}
          onClose={() => {
            setAnchorProfile(null);
          }}
          TransitionComponent={Fade}
          className={style.notifWrapper}
        >
          <ul className={style.profileDropDownMenu}>
            <Link
              to={`/profile/`}
              className={style.linkDropDown}
              onClick={() => {
                setAnchorProfile(null);
              }}
            >
              <li className={style.profileDropDownli}>
                <Profile className={style.dropDownIcon} />
                <span className={style.profileDropDownText}>Profile</span>
              </li>
            </Link>
            <Link
              to={`/profile/saved`}
              className={style.linkDropDown}
              onClick={() => {
                setAnchorProfile(null);
              }}
            >
              <li className={style.profileDropDownli}>
                <Save className={style.dropDownIcon} />
                <span className={style.profileDropDownText}>Saved</span>
              </li>
            </Link>
            <Link
              to="/settings"
              className={style.linkDropDown}
              onClick={() => {
                setAnchorProfile(null);
              }}
            >
              <li className={style.profileDropDownli}>
                <Settings className={style.dropDownIcon} />
                <span className={style.profileDropDownText}>Settings</span>
              </li>
            </Link>
            <Link
              to="/"
              className={`${style.linkDropDown} ${style.logOut}`}
              onClick={() => {
                setAnchorProfile(null);
              }}
            >
              <li
                className={`${style.profileDropDownli} ${style.logOut}`}
                onClick={handleLogout}
              >
                Logout
              </li>
            </Link>
          </ul>
        </Menu>
      </li>
    </ul>
  );
}

export default NavLinks;
