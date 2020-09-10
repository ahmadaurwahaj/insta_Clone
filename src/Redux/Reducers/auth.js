import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  VERIFY_REQUEST,
  VERIFY_SUCCESS,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  GET_USER_DATA_REQUEST,
  SUCESS_GET_USER_DATA,
  FAILURE_GET_USER_DATA,
} from "./../Actions/auth";

const userState = {
  isLoggingIn: false,
  isLoggingOut: false,
  isSigningUp: false,
  isVerifying: false,
  loginError: false,
  logoutError: false,
  signupError: "",
  isAuthenticated: false,
  isRetrievingData: false,
  retrievingError: false,
  retrieveSuccess: false,
  docRef: "",
  userData: {},
  user: {},
};
export default (state = userState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isLoggingIn: true,
        loginError: false,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.user,
        isLoggingIn: false,
        isAuthenticated: true,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isLoggingIn: false,
        isAuthenticated: false,
        loginError: true,
      };
    case GET_USER_DATA_REQUEST:
      return {
        ...state,
        isRetrievingData: true,
        retrieveSuccess: false,
        retrievingError: false,

        isAuthenticated: false,
      };
    case SUCESS_GET_USER_DATA:
      return {
        ...state,
        userData: action.data.userData,
        docRef: action.data.docId,
        isRetrievingData: false,
        retrieveSuccess: true,
        retrievingError: false,
        isAuthenticated: true,
      };
    case FAILURE_GET_USER_DATA:
      return {
        ...state,
        isAuthenticated: false,
        retrievingError: true,
      };
    case SIGNUP_REQUEST:
      return {
        ...state,
        isSigningUp: true,
        signupError: false,
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        isSigningUp: false,
        isAuthenticated: true,
        user: action.user,
      };
    case SIGNUP_FAILURE:
      return {
        ...state,
        isLoggingIn: false,
        isAuthenticated: false,
        signupError: action.errorMsg,
        isSigningUp: false,
      };
    case LOGOUT_REQUEST:
      return {
        ...state,
        isLoggingOut: true,
        logoutError: false,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isLoggingOut: false,
        isAuthenticated: false,
        user: {},
        userData: {},
        docRef: "",
      };
    case LOGOUT_FAILURE:
      return {
        ...state,
        isLoggingOut: false,
        logoutError: true,
      };
    case VERIFY_REQUEST:
      return {
        ...state,
        isVerifying: true,
        verifyingError: false,
      };
    case VERIFY_SUCCESS:
      return {
        ...state,
        isVerifying: false,
      };
    default:
      return state;
  }
};
