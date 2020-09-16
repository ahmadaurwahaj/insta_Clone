import React, { useEffect, useState, useRef } from "react";
import style from "./Posts.module.css";
import SinglePost from "./SinglePost";
import { useSelector } from "react-redux";
import { db } from "../../../../Firebase/firebase";
import darkLoad from "../../../../static/img/darkLoader.gif";
function Posts() {
  const [posts, setPosts] = useState([]);
  const [loadingData, setloadingData] = useState(false);
  const [error, setError] = useState(false);
  const userData = useSelector(state => state.auth.userData);

  const limit = 4;
  let lastNameOfPerson = "";
  let reachedEnd = false;
  const ref = useRef(lastNameOfPerson);
  const reachedEndRef = useRef(reachedEnd);
  const dataExtracted = useRef(0);

  useEffect(() => {
    const following = [...userData.following];
    const followingToUse = [];
    following.forEach(data => followingToUse.push(data.followingUserName));
    let followingSliced = followingToUse.slice(0, 10);

    if (followingSliced.length > 0) {
      setloadingData(true);

      const getPostDataFirstTime = () => {
        const arr = [];
        db.collection("posts")
          .where("authorUserName", "in", followingSliced)
          .orderBy("timeStamp")
          .limit(limit)
          .get()
          .then(res => {
            setloadingData(false);
            res.forEach(data => {
              arr.push(data.data());

              setPosts(prevPost => [
                ...prevPost,
                { ...data.data(), postId: data.id },
              ]);
            });

            if (arr.length !== 0) {
              ref.current = arr[arr.length - 1].timeStamp;
            } else {
              dataExtracted.current += 10;

              if (dataExtracted.current >= followingToUse.length) {
                reachedEndRef.current = true;
              } else {
                followingSliced = followingToUse.slice(
                  dataExtracted.current,
                  dataExtracted.current + 10
                );
              }
            }
          })
          .catch(err => setError(err));
      };

      getPostDataFirstTime();
      const getPostDataNextTime = () => {
        const arr = [];
        if (!reachedEndRef.current) {
          db.collection("posts")
            .where("authorUserName", "in", followingSliced)
            .orderBy("timeStamp")
            .startAfter(ref.current)
            .limit(limit)
            .get()
            .then(res => {
              setloadingData(false);
              res.forEach(data => {
                arr.push(data.data());

                setPosts(prevPost => [
                  ...prevPost,
                  { ...data.data(), postId: data.id },
                ]);
              });

              if (arr.length !== 0) {
                ref.current = arr[arr.length - 1].timeStamp;
              } else {
                dataExtracted.current += 10;
                if (dataExtracted.current >= followingToUse.length) {
                  reachedEnd.current = true;
                } else {
                  followingSliced.current = followingToUse.slice(
                    dataExtracted.current,
                    dataExtracted.current + 10
                  );

                  getPostDataFirstTime();
                }
              }
            })
            .catch(err => setError(err));
        }
      };
      const progressBarFunction = () => {
        if (
          document.documentElement.scrollHeight - window.innerHeight ===
          window.scrollY
        ) {
          getPostDataNextTime();
        }
      };
      document.addEventListener("scroll", progressBarFunction);
      return function cleanUp() {
        document.removeEventListener("scroll", progressBarFunction);
      };
    }
  }, [userData.following, reachedEnd]);

  return (
    <div className={style.mainPostsWrappers}>
      {!loadingData ? (
        <>
          <span>{error}</span>
          {posts.map(
            (data, index) => (
              <SinglePost data={data} key={index} />
            ),
            []
          )}
        </>
      ) : (
        <img src={darkLoad} width="40px" height="40" alt="" />
      )}
    </div>
  );
}

export default Posts;
