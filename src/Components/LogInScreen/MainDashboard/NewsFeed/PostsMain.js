import React, { useState, useEffect } from "react";
import Posts from "./Posts";
import { useSelector } from "react-redux";
import { db } from "../../../../Firebase/firebase";
import style from "./Posts.module.css";
function PostsMain() {
  const [following, setFollowing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const docRef = useSelector(state => state.auth.docRef);
  useEffect(() => {
    db.collection("users")
      .doc(docRef)
      .get()
      .then(res => {
        setFollowing([...res.data().following]);
        setIsLoading(false);
      })
      .catch(err => console.log(err));
  }, [docRef]);

  return (
    <>
      {!isLoading && (
        <>
          {following.length > 0 ? (
            <Posts followingUsers={following} />
          ) : (
            <h4 className={style.noPostMsg}>You havent followed anyone yet!</h4>
          )}
        </>
      )}
    </>
  );
}

export default PostsMain;
