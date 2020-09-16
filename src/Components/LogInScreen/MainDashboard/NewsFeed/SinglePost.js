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

const addLike = (postData, userData, db) => {
  const arr = postData.likes;
  db.collection("posts")
    .doc(postData.docId)
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
export const removeLike = (postData, userData) => {
  const arr = postData.likes;
  const updatedArr = arr.filter(
    data => data.likedByUserName !== userData.personalData.userName
  );
  db.collection("posts").doc(postData.docId).update({
    likes: updatedArr,
  });
  pullNotificiation("likePush", postData, userData);
};

const addComment = (e, userData, postData, comment, setComment) => {
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
        pushNotificiation("recently commmented on your post", "commentPush");
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
  if (isSaved(userData.saved)) {
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

  const [dataError, setDataError] = useState(false);
  const docRef = useSelector(state => state.auth.docRef);
  const [modalOpen, setModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [postDataRequired, setPostDataRequired] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    console.log("useEffect called");
    if (postData.docId !== undefined) {
      setIsLoading(true);
      db.collection("posts")
        .doc(postData.docId)
        .onSnapshot(querySnapshot => {
          setPostDataRequired(...postDataRequired, {
            likes: querySnapshot.data().likes,
            comments: querySnapshot.data().comments,
          });
          setIsLoading(false);
        });
    }
  }, [postData.docId]);
  // const handleClickOpen = () => {
  //   setModalOpen(true);
  // };
  // const handleClose = () => {
  //   setModalOpen(false);
  // };

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
                  onClick={() => removeLike(postData, userData)}
                  className={style.heartReactIcon}
                ></HeartFill>
              ) : (
                <Heart
                  onClick={() => addLike(postData, userData, db)}
                  className={style.heartReactIcon}
                />
              )}
              <Comment className={style.commentIcon} />
            </div>
            <div className={style.bookMarkDiv}>
              <Bookmark className={style.bookMarkIcon} />
            </div>
          </div>
          <div className={style.captionDetails}>
            <h2 className={style.caption}>
              <strong>{postData.authorUserName}</strong> {postData.caption}
            </h2>
            <h6>7 Hours ago</h6>
          </div>
          {postData.comments.length > 0 && (
            <>
              <div className={style.commentSections}>
                {postData.comments.map(
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
          <div className={style.commentSection}>
            <form>
              <textarea
                placeholder="Add a comment..."
                className={style.commentInp}
              />
              <button type="submit" className={style.commentBtn}>
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
