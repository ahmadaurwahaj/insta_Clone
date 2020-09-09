import React, { useState } from "react";
import style from "../../LogOutScreen/LogoutStyle.module.css";
import { Link } from "react-router-dom";
import img from "../../../static/img/instaLogo.png";
import { signupUser } from "../../../Redux/Actions/auth";
import { useDispatch, useSelector } from "react-redux";
import loader from "../../../static/img/loader.gif";
import { Redirect } from "react-router-dom";
function SignUp() {
  const dispatch = useDispatch();
  const signupError = useSelector(state => state.auth.signupError);
  const isSigningUp = useSelector(state => state.auth.isSigningUp);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

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
  const handleSubmit = e => {
    const { email, password, fullName, userName } = user;
    e.preventDefault();
    dispatch(signupUser(email, password, fullName, userName));
  };
  if (isAuthenticated) {
    return <Redirect to="/"></Redirect>;
  }
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
          <form className={style.loginForm} onSubmit={handleSubmit}>
            <input
              className={style.input}
              id="email"
              type="text"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <input
              className={style.input}
              id="full_name"
              type="text"
              name="fullName"
              value={user.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
            <input
              className={style.input}
              id="user_name"
              type="text"
              name="userName"
              value={user.userName}
              onChange={handleChange}
              placeholder="Username"
              required
            />

            <input
              className={style.input}
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <button type="submit" className={style.btn}>
              Sign Up
              {isSigningUp && (
                <img
                  src={loader}
                  className={style.loaderStyle}
                  alt=""
                  width="16"
                  height="16"
                />
              )}
            </button>

            {signupError !== "" && (
              <p className={style.errorMsg}>{signupError}</p>
            )}
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
