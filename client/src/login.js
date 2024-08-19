import { useState, useEffect } from "react";
import Landingpage from "./landingpage";
import './login.css';

const Login = ({ getToken }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    // Get the FCM token
    getToken().then(token => setToken(token));
  }, [getToken]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add form validation or processing here

    // Send a POST request to store the user's information
    fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        location,
        token,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'User created successfully') {
        setIsLoggedIn(true);
      } else {
        console.error(data.message);
      }
    })
    .catch(error => console.error(error));
  };

  if (isLoggedIn) {
    // Render the landing page after login
    return (
      <Landingpage></Landingpage>
    );
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Your Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Login;