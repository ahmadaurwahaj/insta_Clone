import React from "react";
import style from "./Posts.module.css";
// import { db } from "../../../../Firebase/firebase";
import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";

// import Modal from "./../../Modal/Modal";
import {
  BsBookmark as Bookmark,
  BsHeart as Heart,
  BsChatSquare as Comment,
} from "react-icons/bs";
function SinglePost({ data }) {
  return (
    <div className={style.postWrapper}>
      <div className={style.postHeader}>
        <Link to={`/accounts/${data.authorUserName}`}>
          <img
            alt=""
            src={data.authorProfilePicUrl}
            className={style.authorImg}
          />
        </Link>
        <div className={style.description}>
          <Link to={`/accounts/${data.authorUserName}`}>
            <h4 className={style.authorusername}>{data.authorUserName}</h4>
          </Link>
          {/* <h5 className={style.mediaLocation}>
            <RelativeTime value={Date.now() - data.timeStamp.nanoseconds} />
          </h5> */}
        </div>
      </div>
      <div className={style.mediaItem}>
        <img alt="" src={data.mediaUrl} className={style.mediaData} />
      </div>
      <div className={style.footer}>
        <div className={style.footerReactIcons}>
          <Heart className={style.heartReactIcon} />
          <Comment className={style.commentIcon} />
        </div>
        <div className={style.bookMarkDiv}>
          <Bookmark className={style.bookMarkIcon} />
        </div>
      </div>
      <div className={style.captionDetails}>
        <h2 className={style.caption}>
          <strong>{data.authorUserName}</strong> {data.caption}
        </h2>
        <h6>7 Hours ago</h6>
      </div>
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
  );
}

export default SinglePost;
