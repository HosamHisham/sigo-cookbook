import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './removerecipecss.css';

function RecipeList() {
  const { category } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Fetch recipes for the given category
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/recipes/${category}`)
      .then((response) => response.json())
      .then((data) => setRecipes(data))
      .catch((error) => console.error('Error fetching recipes:', error));
  }, [category]);

  // Handle deleting a recipe
  const handleDelete = (id) => {
    const token = localStorage.getItem('token');
    fetch(`http://127.0.0.1:5000/recipes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.message) });
        }
        setRecipes(recipes.filter((recipe) => recipe.id !== id));
        setMessage('Recipe deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting recipe:', error);
        setMessage(`Failed to delete recipe: ${error.message}`);
      });
  };

  // Handle updating a recipe
  const handleUpdate = (id) => {
    navigate(`/update-recipe/${id}`);
  };

  // Handle navigating to a recipe's detail page
  const handleRecipeClick = (id) => {
    navigate(`/recipe/${id}`); // This will navigate to the /recipe/:id route
  };

  return (
    <div className="recipe-list">
      <h3>{category} Recipes</h3>
      {message && <p className="message">{message}</p>}
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <span onClick={() => handleRecipeClick(recipe.id)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
              {recipe.title}
            </span>
            <button onClick={() => handleUpdate(recipe.id)} className="update-button">Update</button>
            <button onClick={() => handleDelete(recipe.id)} className="delete-button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecipeList;
