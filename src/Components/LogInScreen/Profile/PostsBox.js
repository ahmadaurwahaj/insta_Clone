import React from "react";
import style from "./Profile.module.css";
function PostsBox() {
  return (
    <div className={style.postBoxWrapper}>
      <div className={style.singleMediaItem}>
        <img
          src="https://dummyimage.com/600x400/000/fff"
          className={style.postMedia}
          alt=""
        />
      </div>
      <div className={style.singleMediaItem}>
        <img
          src="https://dummyimage.com/600x400/000/fff"
          className={style.postMedia}
          alt=""
        />
      </div>
      <div className={style.singleMediaItem}>
        <img
          src="https://dummyimage.com/600x400/000/fff"
          className={style.postMedia}
          alt=""
        />
      </div>
    </div>
  );
}

export default PostsBox;
