import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Landingpage from "./landingpage";
import './login.css';

const Login = ({ getToken }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    getToken().then(token => setToken(token));
  }, [getToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!name || !email || !location) {
      setError("Please fill out all fields");
      return;
    }

    try {
      const loginResponse = await fetch('/store_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          location,
        }),
      });

      if (loginResponse.ok) {
        const tokenResponse = await fetch('/store_token', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email, 
            token, 
          }),
        });

        if (tokenResponse.ok) {
          setIsLoggedIn(true);
          history.push("/landing"); // Redirect to landing page
        } else {
          setError("Token storage failed");
        }
      } else {
        setError("Login failed");
      }
    } catch (error) {
      setError("Login failed");
    }
  };

  if (isLoggedIn) {
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
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;