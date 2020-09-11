import React, { useState } from "react";
import style from "./Settings.module.css";
import { db, storage } from "../../../Firebase/firebase";
import { useSelector } from "react-redux";
import { myFirebase } from "../../../Firebase/firebase";
import loadingImg from "../../../static/img/loader.gif";
// import { getCurrentUserData } from "../../../Redux/Actions/auth";

export default function Settings({ user }) {
  // const userRef = useSelector(state => state.auth.user);
  const profileData = {
    fullName: user.personalData.fullName,
    userName: user.personalData.userName,
    website: user.personalData.website,
    bio: user.personalData.bio,
    email: user.personalData.email,
    phoneNumber: user.personalData.phoneNumber,
    uid: user.personalData.uid,
    profilePicUrl: user.personalData.profilePicUrl,
  };

  const docRef = useSelector(state => state.auth.docRef);
  const [userData, setuserData] = useState(profileData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [shouldUpdate, setShouldUpdate] = useState(false);
  // const dispatch = useDispatch();

  const handleChange = e => {
    setShouldUpdate(true);
    setuserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleImg = e => {
    setShouldUpdate(true);
    const image = e.target.files[0];
    setuserData({ ...userData, [e.target.name]: image });
  };

  const updateProfile = () => {
    setIsUpdating(true);
    // updateData();
    updateImg(userData.profilePicUrl);
    // setIsUpdating(true);
    // if (validateUserName(userData)) {
    //   let userAuth = myFirebase.auth().currentUser;
    //   userAuth
    //     .updateEmail(userData.email)
    //     .then(function () {
    //       db.collection("users")
    //         .doc(docRef)
    //         .update({ personalData: userData })
    //         .then(res => {
    //           setErrorMsg("Data Updated Successfully");
    //           setIsUpdating(false);
    //           setShouldUpdate(false);
    //         })
    //         .catch(err => {
    //           setErrorMsg("Internal Error");
    //           setIsUpdating(false);
    //         });
    //     })
    //     .catch(function (error) {
    //       setErrorMsg("Email already exists.");
    //       setIsUpdating(false);
    //     });
    // } else {
    //   setErrorMsg("Username already exists.");
    //   setIsUpdating(false);
    // }
  };

  // export const updateData = () => {

  // }

  const updateData = (url = userData.profilePicUrl) => {
    let userAuth = myFirebase.auth().currentUser;
    userAuth
      .updateEmail(userData.email)
      .then(function () {
        db.collection("users")
          .doc(docRef)
          .update({
            personalData: { ...userData, profilePicUrl: url },
          })
          .then(res => {
            setErrorMsg("Data Updated Successfully");
            setIsUpdating(false);
            setShouldUpdate(false);
            // dispatch(getCurrentUserData(userAuth));
            // console.log("j");
          })
          .catch(err => {
            setErrorMsg("Internal Error");
            setIsUpdating(false);
          });
      })
      .catch(function (error) {
        setErrorMsg("Email already exists.");
        setIsUpdating(false);
      });
  };

  const updateImg = profilePicUrl => {
    if (profilePicUrl === user.personalData.profilePicUrl) {
      updateData();
    }
    if (profilePicUrl.type.includes("image")) {
      const uploadTask = storage
        .ref(`images/${profilePicUrl.name}`)
        .put(profilePicUrl);
      uploadTask.on(
        "state_changed",
        snapshot => {},
        error => {
          setErrorMsg(error);
          setIsUpdating(false);
        },
        () => {
          storage
            .ref("images")
            .child(profilePicUrl.name)
            .getDownloadURL()
            .then(url => {
              updateData(url);
              setIsUpdating(false);
            });
        }
      );
    }
  };
  // function validateUserName(userData) {
  //   if (userData.userName === user.personalData.userName) {
  //     console.log("in first");
  //     return true;
  //   } else {
  //     console.log("in second");
  //     db.collection("users")
  //       .where("personalData.userName", "==", userData.userName)
  //       .get()
  //       .then(snapshot => {
  //         console.log(snapshot.docs.length);
  //         if (parseInt(snapshot.docs.length) === 0) {
  //           console.log("passed con");
  //           return true;
  //         } else {
  //           return false;
  //         }
  //       });
  //   }
  // }
  return (
    <div className={style.settingsWrapper}>
      <h1 className={style.heading}>Settings</h1>
      <div className={style.innerContainer}>
        <div className={`${style.settingsSingWrapper} ${style.imgDiv}`}>
          <div className={style.innerDiv}>
            <img
              className={style.imgProfile}
              alt=""
              src={user.personalData.profilePicUrl}
            ></img>
            <div className={style.nameUpdate}>
              <h1>{user.personalData.userName}</h1>
              <input
                type="file"
                name="profilePicUrl"
                onChange={handleImg}
                id="file"
              />
              <label htmlFor="file" className={style.updatePhoto}>
                Update Profile Pic
              </label>
            </div>
          </div>
        </div>
        <div className={`${style.settingsSingWrapper}`}>
          <h6>Name</h6>
          <input
            type="text"
            value={userData.fullName}
            name="fullName"
            className={style.inpUpdate}
            onChange={handleChange}
          />
        </div>
        <div className={`${style.settingsSingWrapper}`}>
          <h6>Username</h6>
          <input
            type="text"
            value={userData.userName}
            name="userName"
            className={style.inpUpdate}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className={`${style.settingsSingWrapper}`}>
          <h6>Website</h6>
          <input
            type="text"
            value={userData.website}
            name="website"
            className={style.inpUpdate}
            onChange={handleChange}
          />
        </div>
        <div className={`${style.settingsSingWrapper}`}>
          <h6>Bio</h6>
          <input
            type="text"
            value={userData.bio}
            name="bio"
            className={style.inpUpdate}
            onChange={handleChange}
          />
        </div>
        <div className={`${style.settingsSingWrapper}`}>
          <h6>Email</h6>
          <input
            type="text"
            value={userData.email}
            name="email"
            className={style.inpUpdate}
            onChange={handleChange}
          />
        </div>
        <div className={`${style.settingsSingWrapper}`}>
          <h6>Phone Number</h6>
          <input
            type="text"
            value={userData.phoneNumber}
            name="phoneNumber"
            className={style.inpUpdate}
            onChange={handleChange}
          />
        </div>
        <div className={style.settingsSingWrapper}>
          <span className={style.msg}>{errorMsg}</span>
          <button
            type="submit"
            className={style.subBtn}
            onClick={updateProfile}
            disabled={!shouldUpdate}
          >
            Submit{" "}
            {isUpdating && (
              <img
                src={loadingImg}
                alt="loading..."
                width="13px"
                height="13px"
              ></img>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
