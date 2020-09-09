import React from "react";
import style from "./Profile.module.css";
import { Route, Switch } from "react-router-dom";
import PostsBox from "./PostsBox";
import NavLinks from "./ProfileMediaHeader";
function Profile() {
  return (
    <div className={style.mainWrapper}>
      <div className={style.profileWrapper}>
        <div className={style.innerProfileContainer}>
          <div className={style.imageDiv}>
            <img src="" className={style.profileImg} alt="" />
          </div>
          <div className={style.detailsDiv}>
            <div className={style.nameEdit}>
              <h1 className={style.userName}>username</h1>
              <button className={style.editProfile}>Edit Profile</button>
            </div>
            <div className={style.followDetails}>
              <h1>
                <strong>?</strong> posts
              </h1>
              <h1>
                <strong>?</strong> followers
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
