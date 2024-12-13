import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';
import './feedback.css';

function Feedback() {
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      setMessage('You need to be logged in to submit feedback.');
      return;
    }

    const token = localStorage.getItem('token');

    fetch('http://127.0.0.1:5000/feedback', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ feedback, userId: user.id })
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Feedback submitted successfully') {
        setMessage('Thank you for your feedback!');
        setFeedback('');
      } else {
        setMessage(data.message);
      }
    })
    .catch(error => {
      console.error('Error submitting feedback:', error);
      setMessage('An error occurred while submitting your feedback.');
    });
  };

  return (
    <div className="feedback-container">
      <h2>Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="feedback">Your Feedback</label>
          <textarea
            id="feedback"
            name="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Feedback</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Feedback;
