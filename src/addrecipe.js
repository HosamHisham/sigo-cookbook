import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';
import './addrecipe.css'; // Import the CSS file

function AddRecipe() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [category, setCategory] = useState('appetizer');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const { user } = useContext(UserContext);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user || user.role !== 'admin') {
      setMessage('You do not have permission to add recipes.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('ingredients', ingredients);
    formData.append('instructions', instructions);
    formData.append('category', category);
    formData.append('image', image);

    const token = localStorage.getItem('token'); // Get the JWT token from local storage
    console.log("Using token:", token); // Verify token usage
    console.log("Form data:", {
      title, description, ingredients, instructions, category, image // Verify data sent
    });

    fetch('http://127.0.0.1:5000/recipes', {
      method: 'POST',
      headers: {
        'Authorization': token, // Include the token in the Authorization header
      },
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Recipe added successfully') {
        setMessage('Recipe added successfully!');
        // Clear the form
        setTitle('');
        setDescription('');
        setIngredients('');
        setInstructions('');
        setCategory('appetizer');
        setImage(null);
      } else {
        setMessage(data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setMessage('An error occurred while adding the recipe.');
    });
  };

  return (
    <div className="add-recipe">
      <h2>Add Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="ingredients">Ingredients</label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="instructions">Instructions</label>
          <textarea
            id="instructions"
            name="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="appetizer">Appetizer</option>
            <option value="main_course">Main Course</option>
            <option value="breakfast">Breakfast</option>
            <option value="dessert">Dessert</option>
            <option value="drink">Drink</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit">Add Recipe</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddRecipe;
