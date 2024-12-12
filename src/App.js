import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './app.css';
import { UserProvider, UserContext } from './UserContext';
import Login from './login';
import Signup from './signup';
import MainCourse from './maincourse';
import Breakfast from './breakfast';
import Appetizer from './appetizer';
import Dessert from './dessert';
import Drinks from './drinks';
import AdminPage from './adminpage';
import AddRecipe from './addrecipe';
import RecipeList from './recipelist'; // Import RecipeList
import RecipeDetails from './recipedetails'; // Import RecipeDetails

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
    padding: '0 20px',
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
    <UserProvider>
      <Router>
        <div className="App" style={containerStyle}>
          <div className="header">
            <h1>
              <Link to="/" style={titleLinkStyle}>Sigo's Cookbook</Link>
            </h1>
            <UserContext.Consumer>
              {({ user, logout }) => (
                <div className="login-signup">
                  {user ? (
                    <>
                      <span>Welcome, {user.username}!</span>
                      <button onClick={logout} className="logout-button">Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login">Login</Link>
                      <Link to="/signup">Signup</Link>
                    </>
                  )}
                </div>
              )}
            </UserContext.Consumer>
            <div className="search-bar">
              <input type="text" placeholder="Search" />
            </div>
          </div>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/main-course" element={<MainCourse />} />
            <Route path="/breakfast" element={<Breakfast />} />
            <Route path="/appetizer" element={<Appetizer />} />
            <Route path="/dessert" element={<Dessert />} />
            <Route path="/drinks" element={<Drinks />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} /> {/* Route for Recipe Details */}
            <Route path="/" element={
              <div>
                <div className="welcome-message">
                  <p>
                    Welcome to Sigo's Cookbook, where luxury meets home cooking. Discover expertly crafted recipes that transform everyday ingredients into gourmet masterpieces, elevating every meal with sophistication and flavor.
                  </p>
                </div>
                <div className="sections">
                  <div className="section" style={sectionStyle}>
                    <Link to="/breakfast">
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
                    <Link to="/appetizer">
                      <img src="/Images/nobbu appe.jpg" alt="Appetizer" style={imageButtonStyle} />
                      <h3>Appetizer</h3>
                    </Link>
                  </div>
                  <div className="section" style={sectionStyle}>
                    <Link to="/dessert">
                      <img src="/Images/dessert.jpg" alt="Dessert" style={imageButtonStyle} />
                      <h3>Dessert</h3>
                    </Link>
                  </div>
                  <div className="section" style={sectionStyle}>
                    <Link to="/drinks">
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
    </UserProvider>
  );
}

export default App;
