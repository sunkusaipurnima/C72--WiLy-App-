/** @format */

import firebase from "firebase";
require("@firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyC-gkAVXdrZLVJvqSobF2riD-XbVJZPkDM",
  authDomain: "wily-194ec.firebaseapp.com",
  projectId: "wily-194ec",
  storageBucket: "wily-194ec.appspot.com",
  messagingSenderId: "859972044433",
  appId: "1:859972044433:web:c788cc79265dd70de4a130",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
