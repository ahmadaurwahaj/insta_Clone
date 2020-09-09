import React, { useState } from "react";
import style from "../../LogOutScreen/LogoutStyle.module.css";
import { Link } from "react-router-dom";
import img from "../../../static/img/instaLogo.png";
function SignIn() {
  const initState = {
    name: "",
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
          <form className={style.loginForm}>
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
              Log In
            </button>
          </form>
        </div>
        <div className={style.signUpDiv}>
          <span>Dont have a account? </span>
          <Link to="/signup" className={style.link}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
