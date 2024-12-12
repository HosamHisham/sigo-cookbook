import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import './logincss.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Login successful') {
        setUser({ username, role: data.role }); // Store user info with role
        localStorage.setItem('token', data.token); // Store the JWT token
        console.log("Stored token:", localStorage.getItem('token')); // Verify token storage
        setMessage('Login successful! Redirecting...');
        console.log("User role:", data.role); // Debug log
        setTimeout(() => {
          if (data.role === 'admin') {
            navigate('/admin'); // Redirect to the admin page
          } else {
            navigate('/'); // Redirect to the home page for non-admin users
          }
        }, 2000); // Delay for user to see the message
      } else {
        setMessage(data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setMessage('An error occurred during login.');
    });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
