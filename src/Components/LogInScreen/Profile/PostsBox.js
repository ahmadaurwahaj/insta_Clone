import React, { useState, useEffect } from "react";
import style from "./Profile.module.css";
import { Link } from "react-router-dom";
function PostsBox({ posts }) {
  const [postData, setPostData] = useState([]);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    if (posts.length > 0) {
      let arr = [];
      posts.forEach(data =>
        data.ref.onSnapshot(querySnapshot => {
          arr.push({ ...querySnapshot.data(), postId: querySnapshot.id });
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
