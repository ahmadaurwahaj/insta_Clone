import firebase from "firebase/app";
import { db } from "../../Firebase/firebase";

export const GET_STORIES_REQUEST = "GET_STORIES_REQUEST";
export const GET_STORIES_SUCCESS = "GET_STORIES_SUCCESS";
export const GET_STORIES_FAILURE = "GET_STORIES_FAILURE";
const requestStories = () => {
  return {
    type: GET_STORIES_REQUEST,
  };
};

export const recieveStories = stories => {
  return {
    type: GET_STORIES_SUCCESS,
    stories,
  };
};

export const storiesError = () => {
  return {
    type: GET_STORIES_FAILURE,
  };
};

export const getStoriesData = following => dispatch => {
  dispatch(requestStories);
  const currentTimeStamp =
    firebase.firestore.Timestamp.now().toMillis() - 24 * 60 * 60 * 1000;
  following.map(data =>
    db
      .collection("users")
      .where("personalData.userName", "==", data.followingUserName)
      .get()
      .then(res =>
        res.forEach(data =>
          db
            .collection("users")
            .doc(data.id)
            .collection("stories")
            .where("createdAt", ">", currentTimeStamp)
            .get()
            .then(res => {
              let arr = [];
              res.forEach(data => arr.push(data.data()));
              if (arr.length > 0) {
                dispatch(recieveStories(arr));
              }
              arr = [];
            })
        )
      )
      .catch(err => dispatch(storiesError))
  );
};
