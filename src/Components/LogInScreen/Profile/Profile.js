import React from "react";
import style from "./Profile.module.css";
import { Route, Link, Switch } from "react-router-dom";
function Profile() {
  return (
    <div className={style.mainWrapper}>
      <div className={style.profileWrapper}>
        <div className={style.innerProfileContainer}>
          <div className={style.imageDiv}>
            <img src="" />
          </div>
          <div className={style.detailsDiv}>
            <h1 className={style.userName}>username</h1>
            <button className={style.editProfile}>Edit Profile</button>
          </div>
          <div className={style.followDetails}>
            <h1>
              <strong>?</strong> Posts
            </h1>
            <h1>
              <strong>?</strong> Followers
            </h1>
            <h1>
              <strong>?</strong> following
            </h1>
          </div>
          <div className={style.nameBioContainer}>
            <h1>Name of User</h1>
            <h4>Bio</h4>
          </div>
        </div>
      </div>
      <div className={style.mediaDisplayDiv}>
        <div className={style.header}>
          <Link to="/profile/">POSTS</Link>
          <Link to="/profile/saved">SAVED</Link>
        </div>
        <div className={style.mediaMain}>
          <Switch>
            <Route path="/profile/" exact>
              PROFILE
            </Route>
            <Route path="/profile/saved/" exact>
              <h1>Hello</h1>
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default Profile;
