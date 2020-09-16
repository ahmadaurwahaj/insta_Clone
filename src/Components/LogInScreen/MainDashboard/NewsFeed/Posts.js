import React, { useEffect, useState, useRef } from "react";
import style from "./Posts.module.css";
import SinglePost from "./SinglePost";
import { useSelector } from "react-redux";
import { db } from "../../../../Firebase/firebase";
import darkLoad from "../../../../static/img/darkLoader.gif";
function Posts() {
  const [posts, setPosts] = useState([]);
  const [loadingData, setloadingData] = useState(true);
  const [error, setError] = useState(false);
  const userData = useSelector(state => state.auth.userData);

  const limit = 4;
  let lastNameOfPerson = "";
  let reachedEnd = false;
  const ref = useRef(lastNameOfPerson);
  const reachedEndRef = useRef(reachedEnd);
  const dataExtracted = useRef(0);
  // const followingSliced = useRef();
  const following = [];
  userData.following.forEach(data => following.push(data.followingUserName));

  let followingSliced = following.slice(0, 10);
  useEffect(() => {
    if (followingSliced.length > 0) {
      setloadingData(true);
      ref.current = "";
      reachedEndRef.current = false;

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
              console.log(arr, posts, "firstTime");
              if (data.data() !== undefined) {
                setPosts(oldPosts => [
                  ...oldPosts,
                  { ...data.data(), postId: data.id },
                ]);
              }
            });
            if (arr.length !== 0) {
              ref.current = arr[arr.length - 1].timeStamp;
            } else {
              dataExtracted.current += 10;
              if (posts.length === 0) {
                setError(true);
              }
              if (dataExtracted.current >= following.length) {
                reachedEndRef.current = true;
              } else {
                followingSliced = following.slice(
                  dataExtracted.current,
                  dataExtracted.current + 10
                );
              }
            }
          })
          .catch(err => console.log(err));
      };

      getPostDataFirstTime();
      const getPostDataNextTime = () => {
        const arr = [];
        if (!reachedEndRef.current) {
          console.log("here", ref.current);
          db.collection("posts")
            .where("authorUserName", "in", followingSliced)
            .orderBy("timeStamp")
            .startAfter(ref.current)
            .limit(limit)
            .get()
            .then(res => {
              // console.log(res, "nextTime");
              setloadingData(false);
              res.forEach(data => {
                arr.push(data.data());
                console.log(arr, posts, "nextTime");
                if (data.data() !== undefined) {
                  setPosts(oldPosts => [
                    ...oldPosts,
                    { ...data.data(), postId: data.id },
                  ]);
                }
              });

              if (arr.length !== 0) {
                ref.current = arr[arr.length - 1].timeStamp;
              } else {
                dataExtracted.current += 10;
                if (dataExtracted.current >= following.length) {
                  reachedEndRef.current = true;
                } else {
                  followingSliced = following.slice(
                    dataExtracted.current,
                    dataExtracted.current + 10
                  );

                  getPostDataFirstTime();
                }
              }
            })
            .catch(err => console.log(err));
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
  }, []);

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
