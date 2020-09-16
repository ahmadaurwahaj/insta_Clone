import React, { useState, useEffect } from "react";
import style from "./Posts.module.css";
import { db } from "../../../../Firebase/firebase";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Modal from "./../../Modal/Modal";

import {
  BsBookmark as Bookmark,
  BsBookmarkCheck as Bookmarked,
  BsHeart as Heart,
  BsHeartFill as HeartFill,
  BsChatSquare as Comment,
} from "react-icons/bs";

export const isLiked = (arr, userData) => {
  if (
    arr.filter(data => data.likedByUserName === userData.personalData.userName)
      .length === 0
  ) {
    return false;
  }
  return true;
};

export const pushNotificiation = (msg, type, postData, userData, db) => {
  let msgToPush = "";
  let notificationsFiltered = null;
  if (postData.authorUserName !== userData.personalData.userName) {
    db.collection("users")
      .where("personalData.userName", "==", postData.authorUserName)
      .get()
      .then(res => {
        res.forEach(doc => {
          const notificationsData = doc.data().notifications;
          if (type === "likePush") {
            if (postData.likes.length >= 1) {
              msgToPush = `${userData.personalData.userName} and ${postData.likes.length} others ${msg}`;
            } else {
              msgToPush = `${userData.personalData.userName}  ${msg}`;
            }
          } else if (type === "commentPush") {
            if (postData.comments.length >= 1) {
              msgToPush = `${userData.personalData.userName} and ${postData.comments.length} others ${msg}`;
            } else {
              msgToPush = `${userData.personalData.userName}  ${msg}`;
            }
          }
          notificationsFiltered = notificationsData.filter(
            data => data.postUrl !== postData.docId || data.type !== type
          );
          db.collection("users")
            .doc(doc.id)
            .update({
              notifications: [
                {
                  type,
                  redirectUrl: `/p/${postData.docId}`,
                  message: `${msgToPush}`,
                  byUser: userData.personalData.userName,
                  postUrl: postData.docId,
                },
                ...notificationsFiltered,
              ],
            });
        });
      });
  }
};

export const pullNotificiation = (type, postData, userData) => {
  if (postData.authorUserName !== userData.personalData.userName) {
    db.collection("users")
      .where("personalData.userName", "==", postData.authorUserName)
      .get()
      .then(res => {
        res.forEach(doc => {
          let notificationsData = doc
            .data()
            .notifications.filter(
              data =>
                data.type !== type ||
                data.postUrl === userData.personalData.userName
            );
          if (type === "likePush") {
            if (postData.likes.length > 1) {
              let msg = "";
              if (postData.likes.length > 2) {
                msg = `${postData.likes[1].likedByUserName} and ${
                  postData.likes.length - 2
                } liked your photo`;
              } else {
                msg = `${postData.likes[0].likedByUserName} liked your photo`;
              }
              const newNotifData = [
                ...notificationsData,
                {
                  type,
                  redirectUrl: `/p/${postData.docId}`,
                  message: `${msg}`,
                  byUser: postData.likes[0].likedByUserName,
                  postUrl: postData.docId,
                },
              ];
              notificationsData = newNotifData;
            }
          }

          db.collection("users")
            .doc(doc.id)
            .update({
              notifications: [...notificationsData],
            });
        });
      });
  }
};

const addLike = (postDataNew, postData, userData, db, docId) => {
  const arr = postDataNew.likes;
  db.collection("posts")
    .doc(docId)
    .update({
      likes: [
        {
          likedByProfilePicUrl: userData.personalData.profilePicUrl,
          likedByUserName: userData.personalData.userName,
        },
        ...arr,
      ],
    });
  pushNotificiation(
    "recently liked your post",
    "likePush",
    postData,
    userData,
    db
  );
};
export const removeLike = (postDataNew, postData, userData, db, docId) => {
  const arr = postDataNew.likes;
  const updatedArr = arr.filter(
    data => data.likedByUserName !== userData.personalData.userName
  );
  db.collection("posts")
    .doc(docId)
    .update({
      likes: updatedArr,
    })
    .then(res => "successfully done this");
  pullNotificiation("likePush", postData, userData, db);
};

const addComment = (e, userData, postData, comment, setComment, db) => {
  e.preventDefault();
  if (comment === "") {
    // console.log("Cant input");
  } else {
    const comments = postData.comments;
    db.collection("posts")
      .doc(postData.docId)
      .update({
        comments: [
          ...comments,
          {
            commentAuthorImg: userData.personalData.profilePicUrl,
            commentAuthorName: userData.personalData.userName,
            commentContent: comment,
          },
        ],
      })
      .then(res => {
        setComment("");
        pushNotificiation(
          "recently commmented on your post",
          "commentPush",
          postData,
          userData,
          db
        );
      });
  }
};

const isSaved = (arr, postData) => {
  if (arr.filter(res => res.ref === postData.docId).length > 0) {
    return true;
  }
  return false;
};
const addToSaved = (userData, docRef, postData) => {
  if (isSaved(userData.saved, postData)) {
    console.log("already in saved");
  } else {
    const saved = userData.saved;
    db.collection("users")
      .doc(docRef)
      .update({
        saved: [
          ...saved,
          {
            ref: postData.docId,
          },
        ],
      });
  }
};
function SinglePost({ postData }) {
  const userData = useSelector(state => state.auth.userData);

  // const [dataError, setDataError] = useState(false);
  const docRef = useSelector(state => state.auth.docRef);
  const [modalOpen, setModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [postDataRequired, setPostDataRequired] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    const unsub = db
      .collection("posts")
      .doc(postData.docId)
      .onSnapshot(querySnapshot => {
        setPostDataRequired({
          likes: querySnapshot.data().likes,
          comments: querySnapshot.data().comments,
        });
        setIsLoading(false);
      });
    return () => {
      unsub();
    };
  }, [postData.docId]);
  const handleClickOpen = () => {
    setModalOpen(true);
  };
  const handleClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      {!isLoading && (
        <div className={style.postWrapper}>
          <div className={style.postHeader}>
            <Link to={`/accounts/${postData.authorUserName}`}>
              <img
                alt=""
                src={postData.authorProfilePicUrl}
                className={style.authorImg}
              />
            </Link>
            <div className={style.description}>
              <Link to={`/accounts/${postData.authorUserName}`}>
                <h4 className={style.authorusername}>
                  {postData.authorUserName}
                </h4>
              </Link>
              {/* <h5 className={style.mediaLocation}>
            <RelativeTime value={Date.now() - data.timeStamp.nanoseconds} />
          </h5> */}
            </div>
          </div>
          <div className={style.mediaItem}>
            <img alt="" src={postData.mediaUrl} className={style.mediaData} />
          </div>
          <div className={style.footer}>
            <div className={style.footerReactIcons}>
              {isLiked(postDataRequired.likes, userData) ? (
                <HeartFill
                  onClick={() =>
                    removeLike(
                      postDataRequired,
                      postData,
                      userData,
                      db,
                      postData.docId
                    )
                  }
                  className={style.heartReactIcon}
                ></HeartFill>
              ) : (
                <Heart
                  onClick={() =>
                    addLike(
                      postDataRequired,
                      postData,
                      userData,
                      db,
                      postData.docId
                    )
                  }
                  className={style.heartReactIcon}
                />
              )}
              <Comment className={style.commentIcon} />
              {postDataRequired.likes.length > 0 && (
                <>
                  {postDataRequired.likes.length > 1 ? (
                    <span className={style.likesCount}>
                      Liked by{" "}
                      <Link
                        to={`/accounts/${postDataRequired.likes[0].likedByUserName}`}
                        className={style.likesLink}
                      >
                        {postDataRequired.likes[0].likedByUserName}
                      </Link>{" "}
                      and{" "}
                      <span
                        className={style.likesLink}
                        onClick={handleClickOpen}
                      >
                        {postDataRequired.likes.length - 1} others
                      </span>
                    </span>
                  ) : (
                    <span className={style.likesCount}>
                      Liked by{" "}
                      <Link
                        to={`/accounts/${postDataRequired.likes[0].likedByUserName}`}
                        className={style.likesLink}
                      >
                        {postDataRequired.likes[0].likedByUserName}
                      </Link>
                    </span>
                  )}
                </>
              )}
              <Modal
                heading="Likes"
                modalData={postDataRequired.likes}
                userNameKey="likedByUserName"
                profilePicKey="likedByProfilePicUrl"
                modalOpen={modalOpen}
                handleClose={handleClose}
              />
            </div>
            <div className={style.bookMarkDiv}>
              {isSaved(userData.saved, postData) ? (
                <Bookmarked
                  onClick={() => addToSaved(userData, docRef, postData)}
                  className={style.bookMarkIcon}
                />
              ) : (
                <Bookmark
                  onClick={() => addToSaved(userData, docRef, postData)}
                  className={style.bookMarkIcon}
                />
              )}
            </div>
          </div>
          {postDataRequired.comments.length > 0 && (
            <>
              <div className={style.commentDisplaySection}>
                {postDataRequired.comments.map(
                  (data, index) => (
                    <div key={index} className={style.singComment}>
                      <div className={style.innerCommentSection}>
                        <Link
                          to={`/accounts/${data.commentAuthorName}`}
                          className={style.authorData}
                        >
                          <img
                            src={data.commentAuthorImg}
                            alt=""
                            className={style.commentImg}
                          ></img>
                        </Link>
                        <div className={style.commentDetails}>
                          <Link to={`/accounts/${data.commentAuthorName}`}>
                            <span className={style.commentAuthorName}>
                              {data.commentAuthorName}
                            </span>
                          </Link>
                          <span className={style.commentContent}>
                            {data.commentContent}
                          </span>
                        </div>
                      </div>
                    </div>
                  ),
                  []
                )}
              </div>
            </>
          )}
          <div className={style.captionDetails}>
            <h2 className={style.caption}>
              <strong>{postData.authorUserName}</strong> {postData.caption}
            </h2>
            <h6>7 Hours ago</h6>
          </div>

          <div className={style.commentSection}>
            <form
              onSubmit={e =>
                addComment(e, userData, postData, comment, setComment, db)
              }
            >
              <textarea
                placeholder="Add a comment..."
                className={style.commentInp}
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
              <button
                type="submit"
                className={style.commentBtn}
                disabled={comment === ""}
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default SinglePost;
