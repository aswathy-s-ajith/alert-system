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
    getToken().then(token => setToken(token));
  }, [getToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can add form validation or processing here
  
    // Send a POST request to store the user's information
    const loginResponse = await fetch('/store_user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        location,
      }),
    }).catch(error => {
      console.error('Login failed:', error);
    });
  
    if (loginResponse.ok) {
      await fetch('/store_token', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email, 
          token, 
        }),
      }).catch(error => {
        console.error('Token storage failed:', error);
      });
      setIsLoggedIn(true);
    } else {
      console.error('Login failed:', loginResponse.statusText);
    }
  };

  if (isLoggedIn) {
    // Render the landing page after login
    return <Landingpage />;
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