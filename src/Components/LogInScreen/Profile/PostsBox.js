import React, { useState, useEffect } from "react";
import style from "./Profile.module.css";
import { Link } from "react-router-dom";
import { db } from "../../../Firebase/firebase";
function PostsBox({ posts }) {
  const [postData, setPostData] = useState([]);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    if (posts.length > 0) {
      let arr = [];
      posts.forEach(data =>
        db
          .collection("posts")
          .doc(data.ref)
          .get()
          .then(res => {
            arr.push({ ...res.data(), postId: res.id });
            setPostData(arr);
          })
      );
    } else {
      setNoData(true);
    }
  }, [posts]);

  return (
    <div className={style.postBoxWrapper}>
      {postData.length > 0 ? (
        postData.map(
          (data, index) => (
            <div key={index} className={style.singleMediaItem}>
              <Link to={`/p/${data.postId}`}>
                <img src={data.mediaUrl} className={style.postMedia} alt="" />
              </Link>
              {/* <>{console.log(data.postId)}</> */}
            </div>
          ),
          []
        )
      ) : (
        <>{noData && <h3 className={style.postMsg}>No Posts</h3>}</>
      )}
    </div>
  );
}

export default PostsBox;
