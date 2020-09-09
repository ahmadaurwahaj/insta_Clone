import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBXPqTr_7QvxXZkBAMQgtagJCb7eGP0cz0",
  authDomain: "instaclone-3323c.firebaseapp.com",
  databaseURL: "https://instaclone-3323c.firebaseio.com",
  projectId: "instaclone-3323c",
  storageBucket: "instaclone-3323c.appspot.com",
  messagingSenderId: "971871611877",
  appId: "1:971871611877:web:22458129939be0fd7f9d0c",
  measurementId: "G-CD211VDRP8",
};

export const myFirebase = firebase.initializeApp(firebaseConfig);
const baseDb = myFirebase.firestore();
export const db = baseDb;
