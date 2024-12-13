import React from 'react';
import { useNavigate } from 'react-router-dom';
import './removerecipecss.css'
const categories = ['Breakfast', 'Main Course', 'Appetizer', 'Dessert', 'Drinks'];

function RemoveRecipe() {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/remove-recipe/${category.toLowerCase()}`);
  };

  return (
    <div>
      <h2>Select a Category</h2>
      {categories.map((category) => (
        <button key={category} onClick={() => handleCategoryClick(category)}>
          {category}
        </button>
      ))}
    </div>
  );
}

export default RemoveRecipe;
