import React, { useState } from "react";
import style from "../../LogOutScreen/LogoutStyle.module.css";
import { Link } from "react-router-dom";
import img from "../../../static/img/instaLogo.png";
function SignUp() {
  const initState = {
    email: "",
    fullName: "",
    userName: "",
    password: "",
  };
  const [user, setUser] = useState(initState);

  const handleChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  return (
    <div className={style.signInMainWrapper}>
      <div className={style.signInInnerWrapper}>
        <div className={style.logInForm}>
          <div className={style.logoTextDiv}>
            <img alt="" className={style.logoText} src={img} />
          </div>
          <h2 className={style.subHeading}>
            Sign up to see photos and videos from your friends.
          </h2>
          <form className={style.loginForm}>
            <input
              className={style.input}
              id=""
              type="text"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <input
              className={style.input}
              id=""
              type="text"
              name="fullName"
              value={user.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
            <input
              className={style.input}
              id=""
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              placeholder="Username"
              required
            />

            <input
              className={style.input}
              type="password"
              id=""
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <button type="submit" className={style.btn}>
              Sign Up
            </button>
          </form>
        </div>
        <div className={style.signUpDiv}>
          <span>Dont have a account? </span>
          <Link to="/" className={style.link}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
