import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/recipes')
      .then(response => response.json())
      .then(data => setRecipes(data));
  }, []);

  return (
    <div className="recipe-list">
      {recipes.map(recipe => (
        <div key={recipe.id} className="recipe-item">
          <Link to={`/recipe/${recipe.id}`}>
            <img src={`http://127.0.0.1:5000/${recipe.image}`} alt={recipe.title} />
            <h3>{recipe.title}</h3>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default RecipeList;
