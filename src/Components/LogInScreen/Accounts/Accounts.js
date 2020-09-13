import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../../../Firebase/firebase";
import Profile from "../Profile/Profile";
import { Redirect } from "react-router-dom";
import style from "./Accounts.module.css";
function Accounts({ match }) {
  const userData = useSelector(state => state.auth.userData);
  const accountUserName = match.params.id;
  const [user, setuser] = useState({});
  const [fetchData, setFetchData] = useState(false);
  const [dataError, setDataError] = useState(false);
  const [docId, setdocId] = useState(null);

  useEffect(() => {
    let userTemp = {};
    if (accountUserName !== userData.personalData.userName) {
      db.collection("users")
        .where("personalData.userName", "==", accountUserName)
        .onSnapshot(querySnapshot => {
          setDataError(true);
          setFetchData(true);
          querySnapshot.forEach(doc => {
            userTemp = { ...userTemp, ...doc.data() };
            setuser({ ...userTemp });
            setdocId(doc.id);
            setDataError(false);
            setFetchData(true);
          });
        });
    }
  }, [accountUserName, userData.personalData.userName]);
  return (
    <div>
      {accountUserName === userData.personalData.userName ? (
        <Redirect to="/profile"></Redirect>
      ) : (
        <>
          {fetchData && (
            <>
              {dataError ? (
                <div className={style.errorMsg}>
                  <h1>No user found</h1>
                </div>
              ) : (
                <>
                  {user !== {} && (
                    <Profile user={user} selfProfile={false} docId={docId} />
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Accounts;
