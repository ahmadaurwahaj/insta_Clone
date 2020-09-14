import React, { useState, useEffect } from "react";
import style from "./SpecificPost.module.css";
import { db } from "../../../Firebase/firebase";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import Modal from "./../Modal/Modal";

import {
  BsBookmark as Bookmark,
  BsBookmarkCheck as Bookmarked,
  BsHeart as Heart,
  BsHeartFill as HeartFill,
  BsChatSquare as Comment,
} from "react-icons/bs";

function SpecificPost({ match }) {
  const [postData, setpostData] = useState(null);
  const [dataError, setDataError] = useState(false);
  const userData = useSelector(state => state.auth.userData);
  const docRef = useSelector(state => state.auth.docRef);
  const [modalOpen, setModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  //   const [like, setLike] = useState(false);
  useEffect(() => {
    const unsub = db
      .collection("posts")
      .doc(match.params.docId)
      .onSnapshot(querySnapshot => {
        if (querySnapshot.data() === undefined) {
          setDataError(true);
        } else {
          setpostData({ ...querySnapshot.data(), docId: querySnapshot.id });
        }
      });

    return () => {
      unsub();
    };
  }, [match.params.docId]);

  const handleClickOpen = () => {
    setModalOpen(true);
  };
  const handleClose = () => {
    setModalOpen(false);
  };

  const isLiked = arr => {
    if (
      arr.filter(
        data => data.likedByUserName === userData.personalData.userName
      ).length === 0
    ) {
      return false;
    }
    return true;
  };

  const pushNotificiation = (msg, type) => {
    let notificationsFiltered = null;
    if (postData.authorUserName !== userData.personalData.userName) {
      db.collection("users")
        .where("personalData.userName", "==", postData.authorUserName)
        .get()
        .then(res => {
          res.forEach(doc => {
            const notificationsData = doc.data().notifications;
            let msgToPush = "";
            msgToPush = "hello";
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

            console.log(
              notificationsFiltered,
              "notifications filtered",
              msgToPush
            );
            db.collection("users").doc(doc.id).update({
              hello: "how are yous",
            });
          });
        });
    }
  };

  const pullNotificiation = type => {
    if (postData.authorUserName !== userData.personalData.userName) {
      db.collection("users")
        .where("personalData.userName", "==", postData.authorUserName)
        .get()
        .then(res => {
          res.forEach(doc => {
            console.log(doc.data().notifications);
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
            console.log("pull", notificationsData);
            db.collection("users")
              .doc(doc.id)
              .update({
                notifications: [...notificationsData],
              });
          });
        });
    }
  };
  const addLike = () => {
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
    pushNotificiation("recently liked your post", "likePush");
  };
  const removeLike = () => {
    const arr = postData.likes;
    const updatedArr = arr.filter(
      data => data.likedByUserName !== userData.personalData.userName
    );
    db.collection("posts").doc(postData.docId).update({
      likes: updatedArr,
    });
    pullNotificiation("likePush");
  };

  const addComment = e => {
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
          // pushNotificiation("recently commmented on your post", "commentPush");
        });
    }
  };
  const isSaved = arr => {
    if (arr.filter(res => res.ref === postData.docId).length > 0) {
      return true;
    }
    return false;
  };
  const addToSaved = () => {
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
  return (
    <div className={style.mainWrapper}>
      {postData !== null ? (
        <div className={style.postContainer}>
          <div className={`${style.imageNameDiv} ${style.nameDivUpper}`}>
            <Link
              to={`/accounts/${postData.authorUserName}`}
              className={style.linkImgName}
            >
              <img
                src={postData.authorProfilePicUrl}
                alt="profilePicUrl"
                className={style.userProfileImg}
              ></img>
              <h3 className={style.authorUserName}>
                {postData.authorUserName}
              </h3>
            </Link>
          </div>
          <div className={style.imageContainer}>
            <img
              src={postData.mediaUrl}
              alt="profilePic"
              className={style.mediaImg}
            />
          </div>
          <div className={style.detailsContainer}>
            <div className={`${style.imageNameDiv} ${style.nameDivLower}`}>
              <Link
                to={`/accounts/${postData.authorUserName}`}
                className={style.linkImgName}
              >
                <img
                  src={postData.authorProfilePicUrl}
                  alt="profilePicUrl"
                  className={style.userProfileImg}
                ></img>
                <h3 className={style.authorUserName}>
                  {postData.authorUserName}
                </h3>
              </Link>
            </div>

            {postData.comments.length > 0 && (
              <>
                <div className={style.commentSection}>
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
            <div className={style.reactDiv}>
              {isLiked(postData.likes) ? (
                <HeartFill
                  onClick={removeLike}
                  className={style.iconReact}
                ></HeartFill>
              ) : (
                <Heart onClick={addLike} className={style.iconReact} />
              )}
              <Comment className={style.iconReact} />
              {isSaved(userData.saved) ? (
                <Bookmarked onClick={addToSaved} className={style.iconReact} />
              ) : (
                <Bookmark onClick={addToSaved} className={style.iconReact} />
              )}
              <div className={style.likedByDiv}>
                <span className={style.likedCountNum}>
                  {postData.likes.length > 0 && (
                    <>
                      {postData.likes.length > 1 ? (
                        <>
                          Liked by
                          <Link
                            to={`/accounts/${postData.likes[0].likedByUserName}`}
                            className={style.likesLink}
                          >
                            {postData.likes[0].likedByUserName}
                          </Link>{" "}
                          and{" "}
                          <span
                            className={style.likesLink}
                            onClick={handleClickOpen}
                          >
                            {postData.likes.length - 1} others
                          </span>
                        </>
                      ) : (
                        <>
                          Liked by
                          <Link
                            to={`/accounts/${postData.likes[0].likedByUserName}`}
                            className={style.likesLink}
                          >
                            {postData.likes[0].likedByUserName}
                          </Link>
                        </>
                      )}
                    </>
                  )}
                  <Modal
                    heading="Likes"
                    modalData={postData.likes}
                    userNameKey="likedByUserName"
                    profilePicKey="likedByProfilePicUrl"
                    modalOpen={modalOpen}
                    handleClose={handleClose}
                  />
                </span>
              </div>
            </div>
            <div className={style.commentPostSection}>
              <form onSubmit={addComment}>
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
        </div>
      ) : (
        <>{dataError && <h1>This post does not exist.</h1>}</>
      )}
    </div>
  );
}

export default SpecificPost;
