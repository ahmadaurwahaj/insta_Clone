import React, { useState } from "react";
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
import { RiAddCircleFill as AddIcon } from "react-icons/ri";
import { Menu } from "@material-ui/core";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import { ImImages as ImageIcon } from "react-icons/im";
import { FaRegWindowClose as Close } from "react-icons/fa";
import { db, storage } from "../../../Firebase/firebase";
import firebase from "firebase/app";
import { useSelector } from "react-redux";
import crypto from "crypto";
// import Message from "./../../../../static/img/email.png";
// import Explore from "./../../../../static/img/explore.png";
function NavLinks({ user }) {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openNotif = Boolean(anchorEl);
  const [anchorProfile, setAnchorProfile] = React.useState(null);
  const openProfile = Boolean(anchorProfile);
  const [open, setOpen] = React.useState(false);
  const [storyMediaUrl, setStoryMediaUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isErrorUploading, setisErrorUploading] = useState("");
  const docRef = useSelector(state => state.auth.docRef);
  const handleImg = e => {
    // setShouldUpdate(true);
    const media = e.target.files[0];
    setStoryMediaUrl(media);
  };
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const uploadImg = () => {
    if (storyMediaUrl !== "") {
      if (storyMediaUrl.type.includes("image")) {
        setIsUploading(true);
        setisErrorUploading("");
        const uuid = `${storyMediaUrl.name}-${crypto
          .randomBytes(16)
          .toString("hex")}`;
        const uploadTask = storage.ref(`images/${uuid}`).put(storyMediaUrl);
        uploadTask.on(
          "state_changed",
          snapshot => {},
          error => {
            setisErrorUploading(error);
            setIsUploading(false);
          },
          () => {
            storage
              .ref("images")
              .child(uuid)
              .getDownloadURL()
              .then(url => {
                addData(url);
                // setIsUpdating(false);
              });
          }
        );
      } else {
        setisErrorUploading("You can upload image only");
      }
    }
  };
  const addData = url => {
    db.collection("users")
      .doc(docRef)
      .collection("stories")
      .add({
        url,
        type: "img",
        headerForStories: {
          userName: user.personalData.userName,
          profilePicUrl: user.personalData.profilePicUrl,
        },
        viewedBy: [],
        createdAt: firebase.firestore.Timestamp.now().toMillis(),
      })
      .then(res => {
        setIsUploading(false);
        setisErrorUploading("");
        handleClose();
      })
      .catch(err => setisErrorUploading(err));
  };
  return (
    <ul className={style.listWrapper}>
      <li className={style.singleItem}>
        <Link to="/">
          <img alt="" src={HomeIcon} className={style.icon}></img>
        </Link>
      </li>
      <li className={style.singleItem}>
        <AddIcon className={style.icon} onClick={handleOpen} />

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="add-story-modal"
          aria-describedby="modal to add stories"
        >
          <div className={style.addStoryModalWrapper}>
            <div className={style.addStoryInnerContainer}>
              <div className={style.addStoryHeader}>
                <h1 className={style.storyHeading}>Add Story</h1>
                <Close className={style.closeIcon} onClick={handleClose} />
              </div>
              <h5 className={style.storyAddDesc}>
                Stories Will disappear after 24 hours
              </h5>
              <div className={style.imageUploadDiv}>
                <input
                  type="file"
                  name="media"
                  onChange={handleImg}
                  id="mediaUrl"
                />
                <label htmlFor="mediaUrl" className={style.updatePhoto}>
                  <ImageIcon className={style.imageIcon} />
                </label>
              </div>

              <button type="" className={style.storyAddBtn} onClick={uploadImg}>
                Add
              </button>
              {isUploading && <span>Uploading...</span>}
              {isErrorUploading !== "" && <h5>{isErrorUploading}</h5>}
            </div>
          </div>
        </Modal>
      </li>

      {/* <li className={style.singleItem}>
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
