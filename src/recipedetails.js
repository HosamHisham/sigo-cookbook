import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = `http://127.0.0.1:5000/recipe/${id}`;
    const token = localStorage.getItem('token');
    console.log('Fetching data from URL:', url);

    if (!token) {
      setError("No authentication token found.");
      return;
    }

    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Response status:', response.status);
      if (!response.ok) {
        console.error(`Error status: ${response.status} - ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (!data || Object.keys(data).length === 0) {
        console.error('Received empty data from backend');
        throw new Error('Received empty data from backend');
      }
      console.log('Fetched recipe:', data);
      setRecipe(data);
    })
    .catch(error => {
      console.error('Error fetching recipe:', error.message);
      setError(error.toString());
    });
  }, [id]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!recipe) {
    return <p>Loading...</p>;
  }

  return (
    <div className="recipe-details">
      <h2>{recipe.title}</h2>
      {recipe.image && <img src={`http://127.0.0.1:5000/${recipe.image}`} alt={recipe.title} />}
      <p><strong>Description:</strong> {recipe.description}</p>
      <h3>Ingredients</h3>
      <p>{recipe.ingredients}</p>
      <h3>Instructions</h3>
      <p>{recipe.instructions}</p>
    </div>
  );
}

export default RecipeDetails;
