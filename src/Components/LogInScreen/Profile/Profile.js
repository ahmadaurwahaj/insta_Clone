import React from "react";
import style from "./Profile.module.css";
import { Route, Switch, Link } from "react-router-dom";
import PostsBox from "./PostsBox";
import NavLinks from "./ProfileMediaHeader";
function Profile({ user }) {
  const numOfPosts = user.posts.length;
  const numOfFollowers = user.followers.length;
  const numOfFollowing = user.following.length;
  console.log(numOfPosts);
  return (
    <div className={style.mainWrapper}>
      <div className={style.profileWrapper}>
        <div className={style.innerProfileContainer}>
          <div className={style.imageDiv}>
            <img
              src={user.personalData.profilePicUrl}
              className={style.profileImg}
              alt=""
            />
          </div>
          <div className={style.detailsDiv}>
            <div className={style.nameEdit}>
              <h1 className={style.userName}>{user.personalData.userName}</h1>
              <Link to="/settings">
                <button className={style.editProfile}>Edit Profile</button>
              </Link>
            </div>
            <div className={style.followDetails}>
              <h1>
                <strong>{numOfPosts}</strong> posts
              </h1>
              <h1>
                <strong>{numOfFollowers}</strong> followers
              </h1>
              <h1>
                <strong>{numOfFollowing}</strong> following
              </h1>
            </div>
            <div className={style.nameBioContainer}>
              <h1>{user.personalData.fullName}</h1>
              <h4>{user.personalData.bio}</h4>
            </div>
          </div>
        </div>
      </div>
      <div className={style.mediaDisplayDiv}>
        <NavLinks />
        <div className={style.mediaMain}>
          <Switch>
            <Route path="/profile/" exact>
              <PostsBox />
            </Route>
            <Route path="/profile/saved/" exact>
              <PostsBox />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default Profile;
