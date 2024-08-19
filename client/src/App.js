import { useEffect, useState } from 'react';
import './App.css';
import Login from './login';
import { requestForToken } from "./config/firebase";


function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
     const getToken = async () => {
       const permission = await Notification.requestPermission();
       if (permission === "granted") {
         const token = await requestForToken();
         if (token) {
           setToken(token);
           console.log(token)
         }
       }
     };

     getToken();
  }, []);

  return (
  
    <Login></Login>
  );
}

export default App;

