import React from "react";
import Header from "./Header/Header";
import Posts from "./MainDashboard/NewsFeed/Posts";
import AddPost from "./AddPost/AddPost";
function HomeDefaultDisplay({ user }) {
  return (
    <div>
      <AddPost />
      <Header />
      <Posts />
    </div>
  );
}

export default HomeDefaultDisplay;
