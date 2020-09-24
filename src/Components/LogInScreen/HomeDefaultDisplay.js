import React from "react";
import Header from "./Header/Header";
import NewsFeed from "./MainDashboard/NewsFeed/PostsMain";
import AddPost from "./AddPost/AddPost";
import StoriesBox from "./MainDashboard/NewsFeed/Stories/StoriesBox";

function HomeDefaultDisplay({ user }) {
  return (
    <div>
      <AddPost />
      <StoriesBox />
      <Header />
      <NewsFeed />
    </div>
  );
}

export default HomeDefaultDisplay;
