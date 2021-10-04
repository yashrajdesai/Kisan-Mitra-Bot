import { initializeApp } from 'firebase/app';
import { getFirestore,collection, getDocs } from 'firebase/firestore/lite';
// import {getFirestore} from "firebase/firestore"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCToJNsvj-D0r2IS7bhwsiff5FEN4vvj2A",
    authDomain: "kisan-mitra-e9137.firebaseapp.com",
    projectId: "kisan-mitra-e9137",
    storageBucket: "kisan-mitra-e9137.appspot.com",
    messagingSenderId: "929184811678",
    appId: "1:929184811678:web:d27ca5b277b1ec5b92898f",
    measurementId: "G-V1Q5BKV9G6"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  

  export {db};
