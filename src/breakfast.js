import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './maincoursecss.css'; // We can use the same CSS file for styling

function Breakfast() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // Fetch recipes from the backend
    fetch('http://127.0.0.1:5000/recipes/breakfast')
      .then(response => response.json())
      .then(data => {
        // Ensure data is an array
        if (Array.isArray(data)) {
          setRecipes(data);
        } else {
          console.error('Expected an array but received:', data);
          setRecipes([]);
        }
      })
      .catch(error => console.error('Error fetching recipes:', error));
  }, []);

  return (
    <div className="main-course">
      <h2>Breakfast</h2>
      <div className="recipe-buttons">
        {recipes.map(recipe => (
          <Link to={`/recipe/${recipe.id}`} key={recipe.id}>
            <button className="recipe-button" style={{ backgroundImage: `url(${recipe.image})` }}>
              <span>{recipe.title}</span>
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Breakfast;
