import React, { useState } from "react";
import style from "./AddPost.module.css";
import { useSelector } from "react-redux";
import { db, storage } from "../../../Firebase/firebase";
import firebase from "firebase/app";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

import LinearProgress from "@material-ui/core/LinearProgress";
// import { v4 as uuidv4 } from "uuid";
import loader from "../../../static/img/loader.gif";
import crypto from "crypto";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
function AddPost() {
  const initState = {
    profilePicUrl: "",
    caption: "",
  };
  const userLocal = useSelector(state => state.auth.userData);
  const [userData, setuserData] = useState(initState);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleImg = e => {
    const image = e.target.files[0];

    if (e.target.files[0] !== undefined) {
      setShouldUpdate(true);
      setuserData({
        ...userData,
        [e.target.name]: image,
      });
    } else {
      setShouldUpdate(false);
      setuserData({
        ...userData,
        [e.target.name]: "",
      });
    }
  };
  const docRef = useSelector(state => state.auth.docRef);
  const updateProfile = e => {
    e.preventDefault();
    setErrorMsg("");
    setIsUpdating(true);
    updateImg(userData.profilePicUrl);
  };

  const updateData = url => {
    db.collection("posts")
      .add({
        authorProfilePicUrl: userLocal.personalData.profilePicUrl,
        authorUserName: userLocal.personalData.userName,
        caption: userData.caption,
        comments: [],
        likes: [],
        mediaUrl: url,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(res => {
        console.log(res.id);
        const savedPosts = userLocal.posts;
        db.collection("users")
          .doc(docRef)
          .update({
            posts: [
              {
                ref: res.id,
              },
              ...savedPosts,
            ],
          })
          .then(res => {
            setIsUpdating(false);
            setShouldUpdate(false);
            setuserData(initState);
            setOpen(true);
          });
        // dispatch(getCurrentUserData(userAuth));
        // console.log("j");
      })
      .catch(err => {
        setErrorMsg("Internal Error");
        setIsUpdating(false);
      });
  };

  const updateImg = profilePicUrl => {
    setErrorMsg("");
    // console.log("image update");
    if (profilePicUrl.type.includes("image") && profilePicUrl !== "") {
      setShowProgress(true);
      const uuid = `${userLocal.personalData.userName}-${
        profilePicUrl.name
      }-${crypto.randomBytes(16).toString("hex")}`;
      const uploadTask = storage.ref(`images/${uuid}`).put(profilePicUrl);
      uploadTask.on(
        "state_changed",
        snapshot => {
          const progressLen = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progressLen);
          console.log(progressLen);
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
              setShowProgress(false);
              setProgress(0);
              updateData(url);
            });
        }
      );
    } else {
      setIsUpdating(false);
      setErrorMsg("Only upload Image");
    }
  };

  return (
    <div className={style.addPostMain}>
      <div className={style.postWrapper}>
        <div className={style.header}>
          <h3 className={style.heading}>Add Post</h3>
        </div>
        <div className={style.mainPostArea}>
          <form onSubmit={updateProfile}>
            <div className={style.dataInputArea}>
              <textarea
                className={style.caption}
                placeholder="Caption..."
                name="caption"
                value={userData.caption}
                onChange={e =>
                  setuserData({ ...userData, caption: e.target.value })
                }
              ></textarea>

              <input
                type="file"
                name="profilePicUrl"
                onChange={handleImg}
                id="file"
              />
              <label htmlFor="file" className={style.updatePhoto}>
                Upload Photo
              </label>
              <span className={style.fileName}>
                {userData.profilePicUrl.name}
              </span>
            </div>
            <div className={style.footerDiv}>
              <button
                type="submit"
                value="Publish"
                className={style.btn}
                disabled={!shouldUpdate}
              >
                Publish{" "}
                {isUpdating && (
                  <img
                    alt=""
                    src={loader}
                    width="14px"
                    height="14px"
                    className={style.loaderImg}
                  ></img>
                )}
              </button>
              {showProgress && (
                <>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    className={style.progress}
                  />
                </>
              )}
              <span className={style.errorMsg}>{errorMsg}</span>
              <Snackbar
                open={open}
                autoHideDuration={1000}
                onClose={handleClose}
              >
                <Alert onClose={handleClose} severity="success">
                  Post Publised Successfully
                </Alert>
              </Snackbar>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPost;
