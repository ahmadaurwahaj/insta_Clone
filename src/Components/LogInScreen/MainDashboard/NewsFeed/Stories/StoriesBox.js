import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import style from "./Stories.module.css";
import { useSelector, useDispatch } from "react-redux";
import { getStoriesData } from "../../../../../Redux/Actions/stories";
function StoriesBox() {
  const userData = useSelector(state => state.auth.userData);
  const storiesData = useSelector(state => state.stories.stories);
  const dispatch = useDispatch();
  useEffect(() => {
    if (storiesData.length <= 0) dispatch(getStoriesData(userData.following));
    console.log(storiesData, "storiesData");
  }, [storiesData.length, dispatch, userData.following, storiesData]);
  return (
    <div className={style.mainWrapper}>
      {storiesData.length > 0 && (
        <ul className={style.innerWrapper}>
          {console.log(storiesData)}
          {storiesData.map(
            (data, index) => (
              <li key={index} className={style.singleItem}>
                <Link to={`/stories/${data[0].headerForStories.userName}`}>
                  <img
                    alt=""
                    src={data[0].headerForStories.profilePicUrl}
                    width="40px"
                    height="40px"
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
