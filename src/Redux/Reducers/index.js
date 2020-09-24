import { combineReducers } from "redux";
import auth from "./auth";
import stories from "./stories";
export default combineReducers({
  auth: auth,
  stories: stories,
});
