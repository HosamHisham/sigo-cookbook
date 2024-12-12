import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './app.css';
import Login from './login';
import Signup from './signup';
import MainCourse from './maincourse'; // Import the MainCourse component

function App() {
  const titleLinkStyle = {
    textDecoration: 'none',
    color: 'inherit',
  };

  const sectionStyle = {
    margin: '10px',
    textAlign: 'center',
  };

  const containerStyle = {
    padding: '0 20px', // Add padding to shift content away from the edges
  };

  const imageButtonStyle = {
    width: '250px',
    height: '200px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    display: 'block',
    objectFit: 'cover',
  };

  return (
    <Router>
      <div className="App" style={containerStyle}>
        <div className="header">
          <h1>
            <Link to="/" style={titleLinkStyle}>Sigo's Cookbook</Link>
          </h1>
          <div className="login-signup">
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Search" />
          </div>
        </div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/main-course" element={<MainCourse />} />
          {/* Add routes for recipes */}
          <Route path="/recipe1" element={<div>Recipe 1 Details</div>} />
          <Route path="/recipe2" element={<div>Recipe 2 Details</div>} />
          <Route path="/" element={
            <div>
              <div className="welcome-message">
                <p>
                  Welcome to Sigo's Cookbook, where luxury meets home cooking. Discover expertly crafted recipes that transform everyday ingredients into gourmet masterpieces, elevating every meal with sophistication and flavor.
                </p>
              </div>
              <div className="sections">
                <div className="section" style={sectionStyle}>
                  <Link to="/main-course">
                    <img src="/Images/brekky.jpeg" alt="Breakfast" style={imageButtonStyle} />
                    <h3>Breakfast</h3>
                  </Link>
                </div>
                <div className="section" style={sectionStyle}>
                  <Link to="/main-course">
                    <img src="/Images/main course.jpg" alt="Main Course" style={imageButtonStyle} />
                    <h3>Main Course</h3>
                  </Link>
                </div>
                <div className="section" style={sectionStyle}>
                  <Link to="/main-course">
                    <img src="/Images/nobbu appe.jpg" alt="Appetizer" style={imageButtonStyle} />
                    <h3>Appetizer</h3>
                  </Link>
                </div>
                <div className="section" style={sectionStyle}>
                  <Link to="/main-course">
                    <img src="/Images/dessert.jpg" alt="Dessert" style={imageButtonStyle} />
                    <h3>Dessert</h3>
                  </Link>
                </div>
                <div className="section" style={sectionStyle}>
                  <Link to="/main-course">
                    <img src="/Images/nobu_drinks.jpg" alt="Drinks" style={imageButtonStyle} />
                    <h3>Drinks</h3>
                  </Link>
                </div>
              </div>
              <div className="footer">
                <button>Enter Feedback</button>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
