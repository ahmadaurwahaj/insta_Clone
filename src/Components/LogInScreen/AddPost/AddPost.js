import React, { useState } from "react";
import style from "./AddPost.module.css";
import { useSelector } from "react-redux";
import { db, storage } from "../../../Firebase/firebase";
import firebase from "firebase/app";
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
  const handleImg = e => {
    setShouldUpdate(true);
    const image = e.target.files[0];
    setuserData({
      ...userData,
      [e.target.name]: image,
    });
  };
  const docRef = useSelector(state => state.auth.docRef);
  const updateProfile = e => {
    e.preventDefault();
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
            setErrorMsg("Data Updated Successfully");
            setIsUpdating(false);
            setShouldUpdate(false);
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
    // console.log("image update");
    if (profilePicUrl.type.includes("image") && profilePicUrl !== "") {
      //   console.log("in updating img");
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
              //   console.log(url);
              updateData(url);
            });
        }
      );
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
            <textarea
              className={style.caption}
              placeholder="Caption..."
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
            <input
              type="submit"
              value="Let's Start"
              className={style.btn}
              disabled={!shouldUpdate}
            />
            {isUpdating && <span>Updating data</span>}
            <span>{errorMsg}</span>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPost;
