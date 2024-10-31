import React, { useEffect, useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { useRestaurant } from '../context/RestaurantContext';
import axios from 'axios';
import '../css/OfficialMenu.css'; // Custom CSS for styling

const OfficialMenu = () => {
    const { id: menuId } = useParams();
    const { restaurantId } = useRestaurant();
    const [menuTitle, setMenuTitle] = useState('');
    const [foodItems, setFoodItems] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize the navigate function

    // Fetch menu data
    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                const menuResponse = await axios.get(`${process.env.REACT_APP_API_URL}/menu/menus/${menuId}/`, {
                });
                setMenuTitle(menuResponse.data.title);
                setFoodItems(menuResponse.data.food_items);
            } catch (error) {
                setError('Failed to load menu details.');
            }
        };

        fetchMenuData();
    }, [menuId, restaurantId, navigate]); // Add navigate to dependencies

    // Group food items by their food type
    const groupedFoodItems = foodItems.reduce((acc, item) => {
        acc[item.food_type] = acc[item.food_type] || [];
        acc[item.food_type].push(item);
        return acc;
    }, {});

    if (error) {
        return <div className="alert alert-danger text-center">{error}</div>;
    }

    return (
        
<div className="menu-background">
  <div className="container menu-container">
    <div className="menu-header text-center mb-3">
      <h1 className="playfair-title text-primary">{menuTitle || 'Menu'}</h1>
      <p className="meddon-regular lora-subtitle text-muted">Discover our delicious offerings</p>
    </div>

    {/* Render each section for food type */}
    {Object.keys(groupedFoodItems).map((foodType, index) => (
      <div key={index} className="food-section mb-5">
        <h2 className="playfair-subheader mb-3">{foodType}</h2>
        {groupedFoodItems[foodType].map((item) => (
          <div key={item.id} className="food-item mb-4">
            <div className="food-item-content">
              <div className="food-details">
                <h5 className="playfair-item-name">{item.name}</h5>
                <p className="meddon-regular lora-item-description">{item.fd_description}</p>
                <p className="playfair-item-price text-success fw-bold">
                  ₹{Number(item.price).toFixed(2)}
                </p>
                {item.special && <span className="playfair-item-special">🌟 Special</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    ))}
  </div>
</div>

    );
};

export default OfficialMenu;
