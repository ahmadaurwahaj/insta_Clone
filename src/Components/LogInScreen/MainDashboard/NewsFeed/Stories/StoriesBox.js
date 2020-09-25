import React from "react";
import { Link } from "react-router-dom";
import style from "./Stories.module.css";
import { useSelector } from "react-redux";
function StoriesBox() {
  const storiesData = useSelector(state => state.stories.stories);
  return (
    <div className={style.mainWrapper}>
      {storiesData.length > 0 && (
        <ul className={style.innerWrapper}>
          {storiesData.map(
            (data, index) => (
              <li key={index} className={style.singleItem}>
                <Link
                  to={`/stories/${data[0].headerForStories.userName}`}
                  className={style.storyLink}
                >
                  <img
                    alt=""
                    src={data[0].headerForStories.profilePicUrl}
                    className={style.stoyDisplayImg}
                  ></img>
                </Link>
              </li>
            ),
            []
          )}
        </ul>
      )}
    </div>
  );
}

export default StoriesBox;
