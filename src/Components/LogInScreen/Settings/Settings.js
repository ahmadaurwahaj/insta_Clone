import React, { useState } from "react";
import style from "./Settings.module.css";

function Settings({ user }) {
  const profileData = {
    name: "Name",
    userName: "userName",
    website: "",
    bio: "",
    email: "",
    phoneNumber: "",
  };

  const [userData, setuserData] = useState(profileData);

  const handleChange = e => {
    setuserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <div className={style.settingsWrapper}>
      <h1 className={style.heading}>Settings</h1>
      <div className={style.innerContainer}>
        <div className={`${style.settingsSingWrapper} ${style.imgDiv}`}>
          <div className={style.innerDiv}>
            <img
              className={style.imgProfile}
              alt=""
              src="https://instagram.flhe3-1.fna.fbcdn.net/v/t51.2885-19/s320x320/82906858_791653004647399_1879646176001654784_n.jpg?_nc_ht=instagram.flhe3-1.fna.fbcdn.net&_nc_ohc=SmNH9bvVA9YAX-RS6QI&oh=35d7846a807075da92e4193652c68e12&oe=5F80D88A"
            ></img>
            <div className={style.nameUpdate}>
              <h1>{user.displayName}</h1>
              <button className={style.updatePhoto}>
                Change Profile Photo
              </button>
            </div>
          </div>
        </div>
        <div className={`${style.settingsSingWrapper}`}>
          <h6>Name</h6>
          <input
            type="text"
            value={userData.name}
            name="name"
            className={style.inpUpdate}
            onChange={handleChange}
          />
        </div>
        <div className={`${style.settingsSingWrapper}`}>
          <h6>Username</h6>
          <input
            type="text"
            value={userData.userName}
            name="userName"
            className={style.inpUpdate}
            onChange={handleChange}
          />
        </div>
        <div className={`${style.settingsSingWrapper}`}>
          <h6>Website</h6>
          <input
            type="text"
            value={userData.website}
            name="website"
            className={style.inpUpdate}
            onChange={handleChange}
          />
        </div>
        <div className={`${style.settingsSingWrapper}`}>
          <h6>Bio</h6>
          <input
            type="text"
            value={userData.bio}
            name="bio"
            className={style.inpUpdate}
            onChange={handleChange}
          />
        </div>
        <div className={`${style.settingsSingWrapper}`}>
          <h6>Email</h6>
          <input
            type="text"
            value={userData.email}
            name="email"
            className={style.inpUpdate}
            onChange={handleChange}
          />
        </div>
        <div className={`${style.settingsSingWrapper}`}>
          <h6>Phone Number</h6>
          <input
            type="text"
            value={userData.phoneNumber}
            name="phoneNumber"
            className={style.inpUpdate}
            onChange={handleChange}
          />
        </div>
        <div className={style.settingsSingWrapper}>
          <button type="submit" className={style.subBtn}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
