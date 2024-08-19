// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getMessaging , getToken} from 'firebase/messaging';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6Reu0MDOgWbjp8FJcAQyvahqoY14M3z8",
  authDomain: "pushnotifs-14721.firebaseapp.com",
  projectId: "pushnotifs-14721",
  storageBucket: "pushnotifs-14721.appspot.com",
  messagingSenderId: "1051477628171",
  appId: "1:1051477628171:web:3640fe01df84a3a73b7e0e",
  measurementId: "G-KN4HSDR3V7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const generateToken = async()=>{
 const permission=await Notification.requestPermission();
 console.log(permission);

 if(permission === 'granted')
 {
  const token = await getToken(messaging,{
    vapidKey:"BCu1cb1TVqKlFXKO4_PQsT928iltKuZuXpK-SiTsPN2zjUBGuHfbq8CB11d2F_nubd3Q0P9Yq4d_gJvKUa-xWj4"
  });
  console.log(token);
 }

};
