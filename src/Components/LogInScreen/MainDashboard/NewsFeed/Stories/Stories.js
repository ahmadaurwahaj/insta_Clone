import React, { useState, useEffect } from "react";
import Stories from "react-insta-stories";
import style from "./Stories.module.css";
import { AiOutlineClose as Close } from "react-icons/ai";
import { useSelector } from "react-redux";
import {
  FaArrowCircleLeft as Left,
  FaArrowCircleRight as Right,
} from "react-icons/fa";
import { db } from "../../../../../Firebase/firebase";
import firebase from "firebase/app";
const StoriesComp = ({ match, user, history }) => {
  const [storiesObj, setstoriesObj] = useState(null);
  const [indexOfStory, setindexOfStory] = useState(0);
  const [noStories, setNoStories] = useState(false);
  const storiesData = useSelector(state => state.stories.stories);
  const [isSelf, setisSelf] = useState(false);
  const docRef = useSelector(state => state.auth.docRef);

  useEffect(() => {
    if (match.params.userName === user.personalData.userName) {
      const currentTimeStamp =
        firebase.firestore.Timestamp.now().toMillis() - 24 * 60 * 60 * 1000;
      setisSelf(true);
      db.collection("users")
        .doc(docRef)
        .collection("stories")
        .where("createdAt", ">", currentTimeStamp)
        .get()
        .then(res => {
          let arr = [];
          res.forEach(data => arr.push(data.data()));
          if (arr.length > 0) {
            setstoriesObj(arr);
          } else {
            setNoStories(false);
          }
          arr = [];
        });
    } else {
      setisSelf(false);
      const getData = userName => {
        for (let i = 0; i < storiesData.length; i++) {
          const singObj = storiesData[i];
          console.log(storiesData[i], "from stories");
          if (singObj[0].headerForStories.userName === userName) {
            setindexOfStory(i);
            setstoriesObj(singObj);
          } else {
            setNoStories(false);
          }
        }
      };
      getData(match.params.userName);
    }

    return () => {
      setindexOfStory(0);
      setstoriesObj(null);
    };
  }, [match.params.userName, storiesData, docRef, user.personalData.userName]);

  const handleClose = () => {
    // setcurrentIndex(0);
    setstoriesObj(null);
    history.push("/");
  };

  const moveNext = () => {
    // setcurrentIndex(0);
    setstoriesObj(null);
    history.push(
      `/stories/${storiesData[indexOfStory + 1][0].headerForStories.userName}`
    );
  };

  const moveBack = () => {
    // setcurrentIndex(0);
    setstoriesObj(null);
    history.push(
      `/stories/${storiesData[indexOfStory - 1][0].headerForStories.userName}`
    );
  };

  const storiesEnd = () => {
    if (indexOfStory + 1 !== storiesData.length) {
      if (!isSelf) {
        moveNext();
      } else {
        history.push("/");
      }
    } else {
      setstoriesObj(null);
      // setcurrentIndex(0);
      history.push("/");
    }
  };
  return (
    <div className={style.storiesWrapper}>
      {storiesObj !== null ? (
        <>
          <div className={style.storiesHeader}>
            <img
              alt=""
              className={style.storyHeaderImg}
              src={storiesObj[0].headerForStories.profilePicUrl}
            ></img>
            <h1>{storiesObj[0].headerForStories.userName}</h1>
            <button onClick={handleClose} className={style.storiesClose}>
              <Close />
            </button>
          </div>
          <div className={style.mainStory}>
            {!isSelf && (
              <>
                {indexOfStory !== 0 && (
                  <Left className={style.leftArrow} onClick={moveBack} />
                )}
              </>
            )}
            <div className={style.storyDiv}>
              {console.log(storiesObj)}
              <Stories
                stories={storiesObj}
                defaultInterval={7000}
                currentIndex={parseInt(0)}
                width="100%"
                height="80vh"
                onAllStoriesEnd={storiesEnd}
                onStoryStart={() => {
                  console.log("i am started");
                }}
              />
            </div>
            <>
              {!isSelf && (
                <>
                  {indexOfStory + 1 !== storiesData.length && (
                    <>
                      <Right className={style.rightArrow} onClick={moveNext} />
                    </>
                  )}
                </>
              )}
            </>
          </div>
        </>
      ) : (
        <>{noStories ? <h1>No Stories</h1> : <h1>Loading</h1>}</>
      )}
    </div>
  );
};
export default StoriesComp;
