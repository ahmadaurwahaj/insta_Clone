import { myFirebase } from "../../Firebase/firebase";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const LOGOUT_REQUEST = "LOGOUT_REQUEST";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_FAILURE = "LOGOUT_FAILURE";

export const SIGNUP_REQUEST = "SIGNUP_REQUEST";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const SIGNUP_FAILURE = "SIGNUP_FAILURE";

export const VERIFY_REQUEST = "VERIFY_REQUEST";
export const VERIFY_SUCCESS = "VERIFY_SUCCESS";

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
  myFirebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(user => {
      dispatch(receiveSignup(user));
      const newUser = myFirebase.auth().currentUser;
      newUser.updateProfile({
        fullName,
        userName,
      });
    })
    .catch(error => {
      dispatch(signupError(error.message));
      console.log(error.message);
    });
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
