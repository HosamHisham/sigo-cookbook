import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import './adminpage.css'; // Import your CSS file

function AdminPage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  if (!user || user.role !== 'admin') {
    return <p>You do not have access to this page.</p>;
  }

  const handleAdd = () => {
    navigate('/add-recipe');
  };

  const handleUpdate = () => {
    navigate('/update-recipe');
  };

  const handleRemove = () => {
    navigate('/remove-recipe');
  };

  return (
    <div className="admin-page">
      <h2>Admin Dashboard</h2>
      <button onClick={handleAdd} className="admin-button">Add Recipe</button>
      <button onClick={handleUpdate} className="admin-button">Update Recipe</button>
      <button onClick={handleRemove} className="admin-button">Remove Recipe</button>
    </div>
  );
}

export default AdminPage;
