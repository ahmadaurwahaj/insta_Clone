import { myFirebase } from "../../Firebase/firebase";
import { db } from "../../Firebase/firebase";
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const LOGOUT_REQUEST = "LOGOUT_REQUEST";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_FAILURE = "LOGOUT_FAILURE";

export const SIGNUP_REQUEST = "SIGNUP_REQUEST";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const SIGNUP_FAILURE = "SIGNUP_FAILURE";

export const GET_USER_DATA_REQUEST = "SET_USER_DATA";
export const SUCESS_GET_USER_DATA = "SUCESS_SET_USER_DATA";
export const FAILURE_GET_USER_DATA = "FAILURE_SET_USER_DATA";

export const VERIFY_REQUEST = "VERIFY_REQUEST";
export const VERIFY_SUCCESS = "VERIFY_SUCCESS";

const retrievedUserData = data => {
  return {
    type: SUCESS_GET_USER_DATA,
    data,
  };
};
export const retrievingDataError = () => {
  return {
    type: FAILURE_GET_USER_DATA,
  };
};

const getUserData = () => {
  return {
    type: GET_USER_DATA_REQUEST,
  };
};
const requestLogin = () => {
  return {
    type: LOGIN_REQUEST,
  };
};

const receiveLogin = user => {
  return {
    type: LOGIN_SUCCESS,
    user,
  };
};

const loginError = () => {
  return {
    type: LOGIN_FAILURE,
  };
};

const requestLogout = () => {
  return {
    type: LOGOUT_REQUEST,
  };
};

const receiveLogout = user => {
  return {
    type: LOGOUT_SUCCESS,
    user,
  };
};

const logoutError = () => {
  return {
    type: LOGOUT_FAILURE,
  };
};

const requestSignup = () => {
  return {
    type: SIGNUP_REQUEST,
  };
};

const receiveSignup = user => {
  return {
    type: SIGNUP_SUCCESS,
    user,
  };
};

const signupError = errorMsg => {
  return {
    type: SIGNUP_FAILURE,
    errorMsg,
  };
};

const verifyRequest = () => {
  return {
    type: VERIFY_REQUEST,
  };
};

const verifySuccess = () => {
  return {
    type: VERIFY_SUCCESS,
  };
};

export const loginUser = (email, password) => dispatch => {
  dispatch(requestLogin());
  myFirebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(user => {
      dispatch(getCurrentUserData(user));
      dispatch(receiveLogin(user));
    })
    .catch(error => {
      dispatch(loginError());
    });
};

export const logoutUser = () => dispatch => {
  dispatch(requestLogout());
  myFirebase
    .auth()
    .signOut()
    .then(() => {
      dispatch(receiveLogout());
    })
    .catch(error => {
      alert(error);
      dispatch(logoutError());
    });
};
export const signupUser = (email, password, fullName, userName) => dispatch => {
  dispatch(requestSignup());
  db.collection("users")
    .where("personalData.userName", "==", userName)
    .get()
    .then(snapshot => {
      if (snapshot.docs.length === 0) {
        myFirebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then(user => {
            dispatch(receiveSignup(user));
            db.collection("users")
              .add({
                personalData: {
                  uid: user.user.uid,
                  fullName,
                  userName,
                  email: user.user.email,
                  phoneNumber: "",
                  website: "",
                  profilePicUrl: "",
                  bio: "",
                  isNewUser: true,
                },
                followers: [],
                following: [],
                posts: [],
                notifications: [],
                saved: [],
              })
              .catch(err => console.log(err));
            dispatch(getUserData(user));
          })
          .catch(error => {
            dispatch(signupError(error.message));
            console.log(error.message);
          });
      } else {
        dispatch(signupError("Username already exists"));
      }
    });
};

export const getCurrentUserData = user => dispatch => {
  dispatch(getUserData());

  let uid = "";
  if (user.uid === undefined) {
    uid = user.user.uid;
  } else {
    uid = user.uid;
  }
  db.collection("users")
    .where("personalData.uid", "==", uid)
    // .get()
    // .catch(err => dispatch(retrievingDataError()));
    .onSnapshot(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // console.log("snapshot");
        dispatch(
          retrievedUserData({
            userData: doc.data(),
            docId: doc.id,
          })
        );
      });
    });
  // .then(snapshot => {
  //   console.log("from getting snapshot", snapshot.docs[0].data());
  //   dispatch(
  //     retrievedUserData({
  //       userData: snapshot.docs[0].data(),
  //       docId: snapshot.docs[0].id,
  //     })
  //   );
  // })
  // .catch(err => dispatch(retrievingDataError()));
};
export const verifyAuth = () => dispatch => {
  dispatch(verifyRequest());
  myFirebase.auth().onAuthStateChanged(user => {
    if (user !== null) {
      dispatch(receiveLogin(user));
    }
    dispatch(verifySuccess());
  });
};

export * from "./auth";
