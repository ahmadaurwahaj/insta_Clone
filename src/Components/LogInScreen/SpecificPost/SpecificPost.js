import React, { useState, useEffect } from "react";
import style from "./SpecificPost.module.css";
import { db } from "../../../Firebase/firebase";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import { MdClose as Close } from "react-icons/md";
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
  const [like, setLike] = useState(false);
  useEffect(() => {
    db.collection("posts")
      .doc(match.params.docId)
      .onSnapshot(querySnapshot => {
        if (querySnapshot.data() === undefined) {
          setDataError(true);
        } else {
          //   console.log("data", querySnapshot.data());
          setpostData({ ...querySnapshot.data(), docId: querySnapshot.id });
        }
      });
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

  const pushNotificiation = type => {
    let msg = "";
    let notificationsFiltered = null;
    // if (postData.authorUserName === userData.personalData.userName) {
    //   console.log(postData.authorUserName);
    db.collection("users")
      .where("personalData.userName", "==", postData.authorUserName)
      .get()
      .then(res => {
        res.forEach(doc => {
          const notificationsData = doc.data().notifications;
          if (type === "likePush") {
            console.log("here");
            const recentNotification = notificationsData.filter(
              data => data.postUrl === postData.docId && data.type === type
            );
            console.log(recentNotification, "hello");
            if (recentNotification.length > 0) {
              if (postData.likes.length > 1) {
                msg = `${userData.personalData.userName} and ${
                  postData.likes.length - 1
                } recently liked your Post`;
              } else {
                msg = `${userData.personalData.userName}  recently liked your Post`;
              }

              console.log(notificationsFiltered);
            } else {
              msg = `${userData.personalData.userName}  recently liked your Post`;
            }
            notificationsFiltered = notificationsData.filter(
              data => data.postUrl !== postData.docId && data.type !== type
            );
          }
          if (type === "likePush") {
            console.log("here");
            const recentNotification = notificationsData.filter(
              data => data.postUrl === postData.docId && data.type === type
            );
            console.log(recentNotification, "hello");
            if (recentNotification.length > 0) {
              if (postData.likes.length > 1) {
                msg = `${userData.personalData.userName} and ${
                  postData.likes.length - 1
                } recently liked your Post`;
              } else {
                msg = `${userData.personalData.userName}  recently liked your Post`;
              }

              console.log(notificationsFiltered);
            } else {
              msg = `${userData.personalData.userName}  recently liked your Post`;
            }
            notificationsFiltered = notificationsData.filter(
              data => data.postUrl !== postData.docId && data.type !== type
            );
          }
          db.collection("users")
            .doc(doc.id)
            .update({
              notifications: [
                ...notificationsFiltered,
                {
                  type,
                  redirectUrl: `/p/${postData.docId}`,
                  message: `${msg}`,
                  byUser: userData.personalData.userName,
                  postUrl: postData.docId,
                },
              ],
            });
        });
      });
    // }
  };

  const pullNotificiation = type => {
    // if (postData.authorUserName !== userData.personalData.userName) {
    //   console.log(postData.authorUserName);
    db.collection("users")
      .where("personalData.userName", "==", postData.authorUserName)
      .get()
      .then(res => {
        res.forEach(doc => {
          const notificationsData = doc
            .data()
            .notifications.filter(
              data =>
                data.postUrl === userData.personalData.userName &&
                data.type === type
            );
          console.log("pull", notificationsData);
          db.collection("users")
            .doc(doc.id)
            .update({
              notifications: [...notificationsData],
            });
        });
      });
    // }
  };
  const addLike = () => {
    const arr = postData.likes;
    db.collection("posts")
      .doc(postData.docId)
      .update({
        likes: [
          ...arr,
          {
            likedByProfilePicUrl: userData.personalData.profilePicUrl,
            likedByUserName: userData.personalData.userName,
          },
        ],
      });
    pushNotificiation("likePush");
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
          <div className={style.imageContainer}>
            <img
              src={postData.mediaUrl}
              alt="profilePic"
              className={style.mediaImg}
            />
          </div>
          <div className={style.detailsContainer}>
            <div className={style.imageNameDiv}>
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
                          </span>{" "}
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
                  <Dialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={modalOpen}
                  >
                    <div className={style.modalWrapper}>
                      <div className={style.modalHeader}>
                        <h3>Likes</h3>
                        <button
                          type="submit"
                          onClick={handleClose}
                          className={style.modalCloseBtn}
                        >
                          <Close className={style.modalClose} />
                        </button>
                      </div>
                      <div className={style.modalDataDiv}>
                        {postData.likes.map(
                          (data, index) => (
                            <React.Fragment key={index}>
                              {index > 0 && (
                                <>
                                  <div
                                    key={data.likedByUserName}
                                    className={style.singleModalDataDiv}
                                  >
                                    <Link
                                      to={`/accounts/${data.likedByUserName}`}
                                      className={style.modalLink}
                                    >
                                      <img
                                        src={data.likedByProfilePicUrl}
                                        alt=""
                                        className={style.modalUserImg}
                                      />
                                      <h3 className={style.authorUserName}>
                                        {data.likedByUserName}
                                      </h3>
                                    </Link>
                                  </div>
                                </>
                              )}
                            </React.Fragment>
                          ),
                          []
                        )}
                      </div>
                    </div>
                  </Dialog>
                </span>
              </div>
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
