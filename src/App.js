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
import RemoveRecipe from './removerecipe';
import RecipeList from './RecipeList';
import RecipeDetails from './recipedetails';
import UpdateRecipe from './updaterecipe'; 

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <div className="header">
            <h1><Link to="/">Sigo's Cookbook</Link></h1>
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
            <Route path="/remove-recipe" element={<RemoveRecipe />} />
            <Route path="/remove-recipe/:category" element={<RecipeList />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} /> {/* Use ID for recipe details */}
            <Route path="/update-recipe/:id" element={<UpdateRecipe />} /> {/* Use ID for update */}
            <Route path="/" element={
              <div>
                <div className="welcome-message">
                  <p>Welcome to Sigo's Cookbook, where luxury meets home cooking</p>
                </div>
                <div className="sections">
                  <div className="section"><Link to="/breakfast"><img src="/Images/brekky.jpeg" alt="Breakfast" /><h3>Breakfast</h3></Link></div>
                  <div className="section"><Link to="/main-course"><img src="/Images/main course.jpg" alt="Main Course" /><h3>Main Course</h3></Link></div>
                  <div className="section"><Link to="/appetizer"><img src="/Images/nobbu appe.jpg" alt="Appetizer" /><h3>Appetizer</h3></Link></div>
                  <div className="section"><Link to="/dessert"><img src="/Images/dessert.jpg" alt="Dessert" /><h3>Dessert</h3></Link></div>
                  <div className="section"><Link to="/drinks"><img src="/Images/nobu_drinks.jpg" alt="Drinks" /><h3>Drinks</h3></Link></div>
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
