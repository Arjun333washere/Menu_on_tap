import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext'; // Import the RestaurantContext
import '../common.css'; // Import common styles
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap

const CreateRestaurant = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setRestaurantId } = useRestaurant(); // Get the setRestaurantId function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('token');

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/menu/restaurants/`, {
        name,
        description,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 201) {
        const restaurantId = response.data.id; // Get the ID of the created restaurant
        setRestaurantId(restaurantId); // Store the restaurant ID in context
        // Navigate to the create menu page, including the restaurant ID
        navigate(`/restaurant/${restaurantId}/create-menu`);
      }
    } catch (error) {
      console.error('Error creating restaurant:', error);
      setError('Failed to create restaurant. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-body">
              <h1 className="text-dark text-center" style={{ fontFamily: "'Raleway', sans-serif", fontWeight: '900', fontSize: '2.5rem', marginBottom: '20px', color: '#1A1A1C' }}>ENTER RESTAURANT DETAILS</h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Restaurant Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    
                  />
                </div>
                {error && <p className="text-danger">{error}</p>}
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Create Restaurant
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRestaurant;
