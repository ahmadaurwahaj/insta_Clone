import React, { useState } from "react";
import style from "../../LogOutScreen/LogoutStyle.module.css";
import { Link } from "react-router-dom";
import img from "../../../static/img/instaLogo.png";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { loginUser } from "../../../Redux/Actions/auth";
import { useDispatch } from "react-redux";
import loader from "../../../static/img/loader.gif";
function SignIn({ isAuthenticated, loginError, isLoggingIn }) {
  const dispatch = useDispatch();
  const initState = {
    email: "",
    password: "",
  };
  const [user, setUser] = useState(initState);

  const handleChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    const { email, password } = user;
    e.preventDefault();
    dispatch(loginUser(email, password));
  };
  if (isAuthenticated) {
    return <Redirect to="/" />;
  } else {
    return (
      <div className={style.signInMainWrapper}>
        <div className={style.signInInnerWrapper}>
          <div className={style.logInForm}>
            <div className={style.logoTextDiv}>
              <img alt="" className={style.logoText} src={img} />
            </div>
            <form className={style.loginForm} onSubmit={handleSubmit}>
              <input
                className={style.input}
                id="email"
                type="text"
                name="email"
                value={user.name}
                onChange={handleChange}
                placeholder="Email"
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
                Log In{" "}
                {isLoggingIn && (
                  <img
                    src={loader}
                    className={style.loaderStyle}
                    alt=""
                    width="16"
                    height="16"
                  />
                )}
              </button>
              {loginError && (
                <>
                  <p className={style.errorMsg}>Invalid Email or Password.</p>
                </>
              )}
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
}
const mapStateToProps = state => {
  return {
    isLoggingIn: state.auth.isLoggingIn,
    loginError: state.auth.loginError,
    isAuthenticated: state.auth.isAuthenticated,
  };
};

// const mapDispatchToProps = dispatch => {
//   return {
//     loginUser: () => dispatch(loginUser()),
//   };
// };
export default connect(mapStateToProps, null)(SignIn);
