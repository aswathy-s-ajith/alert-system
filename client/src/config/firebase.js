import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: "AIzaSyB6Reu0MDOgWbjp8FJcAQyvahqoY14M3z8",
  authDomain: "pushnotifs-14721.firebaseapp.com",
  projectId: "pushnotifs-14721",
  storageBucket: "pushnotifs-14721.appspot.com",
  messagingSenderId: "1051477628171",
  appId: "1:1051477628171:web:3640fe01df84a3a73b7e0e",
  measurementId: "G-KN4HSDR3V7"
};
export const FIREBASE_VAPID_KEY = "BCu1cb1TVqKlFXKO4_PQsT928iltKuZuXpK-SiTsPN2zjUBGuHfbq8CB11d2F_nubd3Q0P9Yq4d_gJvKUa-xWj4";

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = () => {
  return getToken(messaging, { vapidKey: FIREBASE_VAPID_KEY })
    .then((currentToken) => {
      if (currentToken) {
        return currentToken;
      } else {
        alert(
          "No registration token available. Request permission to generate one."
        );
        return null;
      }
    })
    .catch((err) => {
      alert("An error occurred while retrieving token - " + err);
      return null;
    });
};

onMessage(messaging, ({ notification }) => {
  console.log("Message")
  new Notification(notification.title, {
    body: notification.body,
    icon: notification.icon,
  });
});
