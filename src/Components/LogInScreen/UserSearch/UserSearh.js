import React, { useState, useEffect, useRef } from "react";
import style from "./UserSearch.module.css";
import { db } from "../../../Firebase/firebase";
import { Link } from "react-router-dom";
import darkLoader from "../../../static/img/darkLoader.gif";
export default function UserSearh({ match }) {
  const [users, setusers] = useState([]);
  const [loadingData, setloadingData] = useState(true);
  const [error, setError] = useState(false);
  const limit = 30;
  let lastNameOfPerson = "";
  let reachedEnd = false;
  const ref = useRef(lastNameOfPerson);
  const reachedEndRef = useRef(reachedEnd);

  useEffect(() => {
    setusers([]);
    setloadingData(true);
    ref.current = "";
    reachedEndRef.current = false;
    const searchData = () => {
      const arr = [];
      if (!reachedEndRef.current) {
        db.collection("users")
          .where(
            "keywords",
            "array-contains",
            match.params.userName.toLowerCase()
          )
          .orderBy("personalData.fullName")
          .startAfter(ref.current)
          .limit(limit)
          .get()
          .then(res => {
            setloadingData(false);
            res.forEach(data => {
              arr.push(data.data().personalData);
              setusers(prevArr => [...prevArr, data.data().personalData]);
            });

            if (arr.length !== 0) {
              ref.current = arr[arr.length - 1].fullName;
            } else {
              reachedEndRef.current = true;
            }
          })
          .catch(err => setError(err));
      }
    };
    searchData();
    const progressBarFunction = () => {
      if (
        document.documentElement.scrollHeight - window.innerHeight ===
        window.scrollY
      ) {
        searchData();
      }
    };
    document.addEventListener("scroll", progressBarFunction);
    return function cleanUp() {
      document.removeEventListener("scroll", progressBarFunction);
    };
  }, [match.params.userName]);

  return (
    <div className={style.mainWrapper}>
      <>
        {!loadingData ? (
          <>
            {users.length > 0 ? (
              <ul className={style.listWrapper}>
                {users.map(
                  (data, index) => (
                    <li key={index} className={style.listItem}>
                      <Link to={`/accounts/${data.userName}`}>
                        <img
                          src={data.profilePicUrl}
                          alt=""
                          className={style.imgDiv}
                        ></img>
                        <div className={style.namesDiv}>
                          <h1 className={style.userName}>{data.userName}</h1>
                          <h1 className={style.name}>{data.fullName}</h1>
                        </div>
                      </Link>
                    </li>
                  ),
                  []
                )}
              </ul>
            ) : (
              <>
                <h1 className={style.errorMsg}>Data not Found</h1>
                <span>{error}</span>
              </>
            )}
          </>
        ) : (
          <img src={darkLoader} alt="" width="40px" height="40px" />
        )}
      </>
    </div>
  );
}
