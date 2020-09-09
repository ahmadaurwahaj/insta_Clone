import React from "react";
import style from "./Posts.module.css";

import {
  BsBookmark as Bookmark,
  BsHeart as Heart,
  BsChatSquare as Comment,
} from "react-icons/bs";
// import { FaRegComment as Comment } from "react-icons/fa";
// import { VscComment as Comment } from "react-icons/vsc";
function Posts({ type = "video" }) {
  return (
    <div className={style.mainPostsWrappers}>
      <div className={style.postWrapper}>
        <div className={style.postHeader}>
          <img
            alt=""
            src="https://instagram.flhe3-1.fna.fbcdn.net/v/t51.2885-19/s150x150/82504203_184828082887532_557036608088440832_n.jpg?_nc_ht=instagram.flhe3-1.fna.fbcdn.net&_nc_ohc=QoF9-oEmtHwAX9a6iam&oh=794176c42d1beb01a132e6e281679ebe&oe=5F7DFA15"
            className={style.authorImg}
          />
          <div className={style.description}>
            <h4 className={style.authorusername}>Wajahat.khokhar333</h4>
            <h5 className={style.mediaLocation}>Khokhar house</h5>
          </div>
        </div>
        <div className={style.mediaItem}>
          {type === "video" ? (
            <img
              alt=""
              src="https://cdn.searchenginejournal.com/wp-content/uploads/2019/07/the-essential-guide-to-using-images-legally-online-1520x800.png"
              className={style.mediaData}
            />
          ) : (
            <video alt="" width="320" height="240" controls>
              <source src="" type="video/mp4" />
              <source src="" type="video/ogg" />
            </video>
          )}
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
            <strong>nosher007</strong> Here you go Islamabad
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
    </div>
  );
}

export default Posts;
