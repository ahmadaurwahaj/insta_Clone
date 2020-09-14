import React, { useState } from "react";
import style from "./Profile.module.css";
import { Link } from "react-router-dom";
import PostsBox from "./PostsBox";
import NavLinks from "./ProfileMediaHeader";
import { useSelector } from "react-redux";
import { db } from "../../../Firebase/firebase";

import Modal from "../Modal/Modal";

function Profile({ user, match, selfProfile, docId }) {
  const numOfPosts = user.posts.length;
  const numOfFollowers = user.followers.length;
  const numOfFollowing = user.following.length;
  const userData = useSelector(state => state.auth.userData);
  const docRef = useSelector(state => state.auth.docRef);
  const postData = user.posts;

  const modalState = {
    followModal: false,
    followingModal: false,
  };

  const [modalOpen, setmodalOpen] = useState(modalState);

  const handleOpen = key => {
    setmodalOpen({ ...modalOpen, [key]: true });
  };

  const handleClose = key => {
    setmodalOpen({ ...modalOpen, [key]: false });
  };
  const isFollowed = () => {
    if (
      user.followers.filter(
        data => data.followerUserName === userData.personalData.userName
      ).length === 1
    ) {
      return true;
    }
    return false;
  };

  const removeFollow = () => {
    // console.log("hello from remove");
    const selfFollowing = userData.following.filter(
      data => data.followingUserName !== user.personalData.userName
    );
    const userFollowers = user.followers.filter(
      data => data.followerUserName !== userData.personalData.userName
    );

    const notifications = user.notifications.filter(
      data =>
        data.byUser !== userData.personalData.userName ||
        data.type !== "followPush"
    );
    db.collection("users").doc(docId).update({
      followers: userFollowers,
      notifications,
    });
    db.collection("users").doc(docRef).update({
      following: selfFollowing,
    });
  };

  const addFollow = () => {
    const selfFollowing = userData.following;
    const userFollowers = user.followers;
    const notifications = user.notifications;

    db.collection("users")
      .doc(docRef)
      .update({
        following: [
          ...selfFollowing,
          {
            followingUserName: user.personalData.userName,
            followingPicUrl: user.personalData.profilePicUrl,
          },
        ],
      });

    db.collection("users")
      .doc(docId)
      .update({
        followers: [
          ...userFollowers,
          {
            followerUserName: userData.personalData.userName,
            followerPicUrl: userData.personalData.profilePicUrl,
          },
        ],
        notifications: [
          {
            byUser: userData.personalData.userName,
            message: `${userData.personalData.userName} started following you`,
            redirectUrl: `/accounts/${userData.personalData.userName}`,
            type: "followPush",
          },
          ...notifications,
        ],
      });
  };

  return (
    <div className={style.mainWrapper}>
      <div className={style.profileWrapper}>
        <div className={style.innerProfileContainer}>
          <div className={style.imageDiv}>
            <img
              src={user.personalData.profilePicUrl}
              className={style.profileImg}
              alt=""
            />
          </div>
          <div className={style.detailsDiv}>
            <div className={style.nameEdit}>
              <h1 className={style.userName}>{user.personalData.userName}</h1>
              {selfProfile ? (
                <Link to="/settings">
                  <button className={style.editProfile}>Edit Profile</button>
                </Link>
              ) : (
                <>
                  {isFollowed() ? (
                    <button
                      className={style.editProfile}
                      onClick={removeFollow}
                    >
                      Following
                    </button>
                  ) : (
                    <button className={style.editProfile} onClick={addFollow}>
                      Follow
                    </button>
                  )}
                </>
              )}
            </div>
            <div className={style.followDetails}>
              <h1>
                <strong>{numOfPosts}</strong> posts
              </h1>
              <h1>
                <span
                  onClick={() => handleOpen("followingModal")}
                  className={style.modalBtn}
                >
                  <strong>{numOfFollowers}</strong> followers
                </span>
              </h1>
              <h1>
                <span
                  onClick={() => handleOpen("followingModal")}
                  className={style.modalBtn}
                >
                  <strong>{numOfFollowing}</strong> following
                </span>
              </h1>
            </div>
            <div className={style.nameBioContainer}>
              <h1>{user.personalData.fullName}</h1>
              <h4>{user.personalData.bio}</h4>
            </div>
          </div>
        </div>
      </div>
      <div className={style.mediaDisplayDiv}>
        {selfProfile && <NavLinks isExact={match.isExact} />}
        <div className={style.mediaMain}>
          {selfProfile ? (
            <>
              {match.isExact === true && <PostsBox posts={user.posts} />}
              {match.isExact === false && <PostsBox posts={user.saved} />}
            </>
          ) : (
            <PostsBox posts={postData} />
          )}
        </div>
      </div>

      <Modal
        heading="Following"
        modalData={user.following}
        userNameKey="followingUserName"
        profilePicKey="followingPicUrl"
        modalOpen={modalOpen.followingModal}
        handleClose={() => handleClose("followingModal")}
      />
      <Modal
        heading="Followers"
        modalData={user.followers}
        userNameKey="followerUserName"
        profilePicKey="followerPicUrl"
        modalOpen={modalOpen.followModal}
        handleClose={() => handleClose("followModal")}
      />
    </div>
  );
}

export default Profile;
