import React, { useState, useEffect } from "react";
import style from "./Profile.module.css";
import { Link } from "react-router-dom";
import { db } from "../../../Firebase/firebase";
import darkLoader from "../../../static/img/darkLoader.gif";
function PostsBox({ posts }) {
  const [postData, setPostData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  useEffect(() => {
    setLoadingData(true);
    if (posts.length > 0) {
      let arr = [];
      posts.forEach(data => {
        const unsub = db
          .collection("posts")
          .doc(data.ref)
          .get()
          .then(res => {
            setLoadingData(false);
            arr.push({ ...res.data(), postId: res.id });
            setPostData([...arr]);
          });

        return () => {
          unsub();
        };
      });
    } else {
      setNoData(true);
      setLoadingData(false);
    }
  }, [posts]);

  return (
    <div className={style.postBoxWrapper}>
      {loadingData ? (
        <img
          src={darkLoader}
          width="50px"
          height="50px"
          className={style.loaderImg}
          alt=""
        ></img>
      ) : (
        <>
          {postData.length > 0 ? (
            postData.map(
              (data, index) => (
                <div key={index} className={style.singleMediaItem}>
                  <Link to={`/p/${data.postId}`}>
                    <img
                      src={data.mediaUrl}
                      className={style.postMedia}
                      alt=""
                    />
                  </Link>
                </div>
              ),
              []
            )
          ) : (
            <>{noData && <h3 className={style.postMsg}>No Posts</h3>}</>
          )}
        </>
      )}
    </div>
  );
}

export default PostsBox;
