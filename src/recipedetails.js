import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/recipes/${id}`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched recipe:', data); // Debug log
        setRecipe(data);
      })
      .catch(error => {
        console.error('Error fetching recipe:', error);
      });
  }, [id]);

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
