// App.js
import { useEffect, useState } from 'react';
import './App.css';
import Login from './login';
import { requestForToken } from "./config/firebase";

function App() {
  const [token, setToken] = useState("");
  const [error, setError] = useState(null);

  const getToken = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await requestForToken();
        if (token) {
          setToken(token);
          console.log(token);
        }
      }
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  return (
    <Login token={token} error={error} getToken={getToken} />
  );
}

export default App;