import React, { useState, useEffect } from "react";
import Stories from "react-insta-stories";
import style from "./Stories.module.css";
import { AiOutlineClose as Close } from "react-icons/ai";
import { useSelector } from "react-redux";
import {
  FaArrowCircleLeft as Left,
  FaArrowCircleRight as Right,
} from "react-icons/fa";
const StoriesComp = ({ match, user, history }) => {
  const [storiesObj, setstoriesObj] = useState(null);
  const [indexOfStory, setindexOfStory] = useState(0);
  const storiesData = useSelector(state => state.stories.stories);
  useEffect(() => {
    const getData = userName => {
      for (let i = 0; i < storiesData.length; i++) {
        const singObj = storiesData[i];
        console.log(storiesData[i], "from stories");
        if (singObj[0].headerForStories.userName === userName) {
          setindexOfStory(i);
          setstoriesObj(singObj);
          console.log(singObj);
        }
      }
    };
    getData(match.params.userName);

    return () => {
      setindexOfStory(0);
      setstoriesObj(null);
      console.log("iam triggered");
    };
  }, [match.params.userName, storiesData]);

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
      moveNext();
    } else {
      setstoriesObj(null);
      // setcurrentIndex(0);
      history.push("/");
    }
  };
  return (
    storiesObj !== null && (
      <div className={style.storiesWrapper}>
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
          {indexOfStory !== 0 && (
            <Left className={style.leftArrow} onClick={moveBack} />
          )}
          <div className={style.storyDiv}>
            {console.log(storiesObj)}
            <Stories
              stories={storiesObj}
              defaultInterval={7000}
              // currentIndex={parseInt(0)}
              width="100%"
              height="80vh"
              onAllStoriesEnd={storiesEnd}
              onStoryStart={() => {
                console.log("i am started");
              }}
              // currentIndex={parseInt(currentIndex)}
            />
          </div>
          {indexOfStory + 1 !== storiesData.length && (
            <>
              <Right className={style.rightArrow} onClick={moveNext} />
            </>
          )}
        </div>
      </div>
    )
  );
};

export default StoriesComp;
