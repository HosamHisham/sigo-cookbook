import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './removerecipecss.css';

function RecipeList() {
  const { category } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const navigate = useNavigate();

  // Fetch recipes for the given category
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/recipes/${category}`)
      .then((response) => response.json())
      .then((data) => {
        setRecipes(data);
        setFilteredRecipes(data); // Initially, set filtered recipes to all recipes
      })
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
    navigate(`/recipe/${id}`);
  };

  // Handle search input change and filter recipes automatically
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update the search query
  };

  // Handle search button click (filter the recipes)
  const handleSearchClick = () => {
    // Filter recipes based on the search query
    if (searchQuery === '') {
      setFilteredRecipes(recipes); // If search is empty, show all recipes
    } else {
      const filtered = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by title
      );
      setFilteredRecipes(filtered);
    }
  };

  return (
    <div className="recipe-list">
      <h3>{category} Recipes</h3>

      {/* Search bar with button */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={handleSearchChange} // Update the search query as user types
        />
        <button onClick={handleSearchClick}>Search</button> {/* Trigger search on click */}
      </div>

      {message && <p className="message">{message}</p>}
      <ul>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <li key={recipe.id}>
              <span
                onClick={() => handleRecipeClick(recipe.id)}
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                {recipe.title}
              </span>
              <button onClick={() => handleUpdate(recipe.id)} className="update-button">Update</button>
              <button onClick={() => handleDelete(recipe.id)} className="delete-button">Delete</button>
            </li>
          ))
        ) : (
          <p>No recipes found</p>
        )}
      </ul>
    </div>
  );
}

export default RecipeList;
