import React, { useState } from "react";
import style from "./SignupSetUp.module.css";
import ProfilePhoto from "./../../../static/img/profilePhoto.png";
import { db, storage } from "../../../Firebase/firebase";
// import Loader from "../../../static/img/loader.gif";
import crypto from "crypto";
import { useSelector } from "react-redux";
function SignUpSetup() {
  const initState = {
    profilePicUrl: "",
    bio: "",
  };

  const docRef = useSelector(state => state.auth.docRef);
  const user = useSelector(state => state.auth.userData);
  // const user = useSelector(state => state.auth.userData);
  const [userData, setuserData] = useState(initState);
  const [displayPic, setDisplayPic] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [shouldUpdate, setShouldUpdate] = useState(false);

  const updateProfile = () => {
    // setIsUpdating(true);
    updateImg(userData.profilePicUrl);
  };

  const updateData = url => {
    db.collection("users")
      .doc(docRef)
      .update({
        "personalData.profilePicUrl": url,
        "personalData.bio": userData.bio,
        "personalData.isNewUser": false,
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
  };

  const updateImg = profilePicUrl => {
    // console.log("image update");
    if (profilePicUrl.type.includes("image")) {
      const uuid = `${user.personalData.userName}-${
        profilePicUrl.name
      }-${crypto.randomBytes(16).toString("hex")}`;
      const uploadTask = storage.ref(`images/${uuid}`).put(profilePicUrl);

      uploadTask.on(
        "state_changed",
        snapshot => {
          console.log(snapshot.bytesTransferred);
        },
        error => {
          setErrorMsg(error);
          setIsUpdating(false);
        },
        () => {
          storage
            .ref("images")
            .child(uuid)
            .getDownloadURL()
            .then(url => {
              //   console.log(url);
              updateData(url);
            });
        }
      );
    }
  };
  const handleImg = e => {
    setShouldUpdate(true);
    const image = e.target.files[0];
    setuserData({
      ...userData,
      [e.target.name]: image,
    });
    setDisplayPic(URL.createObjectURL(image));
  };

  //   console.log(shouldUpdate);
  return (
    <div className={style.mainWrapper}>
      <h1 className={style.heading}>Setup Profile</h1>
      <div className={style.innerWrapper}>
        {displayPic === null ? (
          <img
            src={ProfilePhoto}
            alt=""
            width="128px"
            height="128px"
            // className={style.ProfImg}
          />
        ) : (
          <img
            src={displayPic}
            alt=""
            width="128px"
            height="128px"
            className={style.ProfImg}
          />
        )}
        <input
          type="file"
          name="profilePicUrl"
          onChange={handleImg}
          id="file"
        />
        <label htmlFor="file" className={style.updatePhoto}>
          Update Profile Pic
        </label>
        <input
          type="text"
          name="bio"
          value={userData.bio}
          onChange={e =>
            setuserData({ ...userData, [e.target.name]: e.target.value })
          }
          className={style.input}
          placeholder="Bio"
        />

        <input
          type="submit"
          value="Let's Start"
          className={style.btn}
          disabled={!shouldUpdate}
          onClick={updateProfile}
        />
        {isUpdating && <span>Updating data</span>}
        <span>{errorMsg}</span>
      </div>
    </div>
  );
}

export default SignUpSetup;
