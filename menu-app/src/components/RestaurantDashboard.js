import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext';
//ui
import { FaUtensils, FaInfoCircle, FaEdit, FaFileAlt, FaQrcode, FaTrash } from 'react-icons/fa'; // Import icons for buttons
import '../css/Dashboard.css';

const RestaurantDashboard = () => {
    const { id } = useParams(); // Restaurant ID from URL
    const [restaurant, setRestaurant] = useState(null); // Restaurant data
    const [menuId, setMenuId] = useState(null); // Menu ID
    const [hasQRCode, setHasQRCode] = useState(false); // Track if QR code is available
    const [error, setError] = useState(''); // Error messages
    const [successMessage, setSuccessMessage] = useState(''); // Success messages

    const navigate = useNavigate();
    const { setRestaurantId } = useRestaurant(); // Update restaurant ID in context

    // Fetch restaurant and menu data
    useEffect(() => {
        const fetchRestaurantAndMenu = async () => {
            const access_token = localStorage.getItem('access_token');
            try {
                // Fetch Restaurant Data
                const restaurantResponse = await axios.get(`http://127.0.0.1:8000/menu/restaurants/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });
                setRestaurant(restaurantResponse.data);
                setRestaurantId(id); // Set restaurant ID in context

                // Fetch Menu Data
                const menuResponse = await axios.get(`http://127.0.0.1:8000/menu/menus/?restaurant=${id}`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });

                if (menuResponse.data && menuResponse.data.length > 0) {
                    const correctMenu = menuResponse.data.find(menu => menu.restaurant === parseInt(id));
                    if (correctMenu) {
                        setMenuId(correctMenu.id);
                        setHasQRCode(correctMenu.qr_code !== null); // Check for QR code
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load restaurant or menu details.');
            }
        };

        fetchRestaurantAndMenu();
    }, [id, setRestaurantId]);

    // Handle delete restaurant
    const handleDelete = async () => {
        const access_token = localStorage.getItem('access_token');
        try {
            await axios.delete(`http://127.0.0.1:8000/menu/restaurants/${id}/`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            setSuccessMessage('Restaurant deleted successfully.');
            navigate('/');
        } catch (error) {
            console.error('Error deleting restaurant:', error);
            setError('Failed to delete restaurant.');
        }
    };

    // Generate QR code for the menu
    const handleGenerateQRCode = async () => {
        if (!menuId) {
            setError('No menu available to generate QR code.');
            return;
        }

        const access_token = localStorage.getItem('access_token');
        try {
            await axios.post(`http://127.0.0.1:8000/menu/menus/${menuId}/generate-qr-code/`, {}, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            setSuccessMessage('QR code generated successfully.');
            setHasQRCode(true); // Update state after generating QR code
        } catch (error) {
            console.error('Error generating QR code:', error);
            setError('Failed to generate QR code.');
        }
    };

    // Download the generated QR code
    const handleDownloadQRCode = async () => {
        if (!menuId) {
            setError('No menu available to download QR code.');
            return;
        }

        const access_token = localStorage.getItem('access_token');
        try {
            const response = await axios.get(`http://127.0.0.1:8000/menu/menus/${menuId}/download-qr-code/`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `qr_code_${menuId}.png`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Error downloading QR code:', error);
            setError('Failed to download QR code.');
        }
    };

    return (
 
            <div className="dashboard-container" style={{ backgroundColor: '#F3F7FA', padding: '20px' }}>
              <div className="container py-4">
                <div className="row">
                  <div className="col-12">
                    <div className="card dashboard-card shadow-lg">
                      {error && <div className="alert alert-danger">{error}</div>}
                      {successMessage && <div className="alert alert-success">{successMessage}</div>}
          
                      {!restaurant ? (
                        <p className="text-center">Loading...</p>
                      ) : (
                        <>
                          {/* Header Section */}
                          <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="text-dark">Hey {restaurant.name}!</h2>
                            <button className="btn btn-outline-secondary" onClick={() => navigate(`/restaurant/${restaurant.id}/info`)}>
                              <FaInfoCircle className="me-2" /> View Restaurant info
                            </button>
                          </div>
          
                          <p className="text-muted mb-4">{restaurant.description}</p>
          
                          {/* Action Buttons */}
                          <div className="row g-3">
                            <div className="col-md-6 col-lg-3">
                              <div className="card action-card shadow-sm h-100">
                                <div className="card-body d-flex flex-column justify-content-between">
                                  <FaEdit className="action-icon mb-3" />
                                  <h5>Edit Food Items</h5>
                                  <button className="btn btn-primary w-100" onClick={() => navigate(`/restaurant/${restaurant.id}/add-food`)}>
                                    <FaUtensils className="me-2" /> Edit Food
                                  </button>
                                </div>
                              </div>
                            </div>
          
                            {!restaurant.has_menu && (
                              <div className="col-md-6 col-lg-3">
                                <div className="card action-card shadow-sm h-100">
                                  <div className="card-body d-flex flex-column justify-content-between">
                                    <FaFileAlt className="action-icon mb-3" />
                                    <h5>Create Menu</h5>
                                    <button className="btn btn-warning w-100" onClick={() => navigate(`/restaurant/${restaurant.id}/create-menu`)}>
                                      <FaFileAlt className="me-2" /> Create Menu
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
          
                            {menuId && (
                              <>
                                <div className="col-md-6 col-lg-3">
                                  <div className="card action-card shadow-sm h-100">
                                    <div className="card-body d-flex flex-column justify-content-between">
                                      <FaUtensils className="action-icon mb-3" />
                                      <h5>View Customer Menu</h5>
                                      <button className="btn btn-info w-100" onClick={() => navigate(`/restaurant/${menuId}/view-menu`)}>
                                        <FaUtensils className="me-2" /> View Your Menu !
                                      </button>
                                    </div>
                                  </div>
                                </div>
          
                                {!hasQRCode ? (
                                  <div className="col-md-6 col-lg-3">
                                    <div className="card action-card shadow-sm h-100">
                                      <div className="card-body d-flex flex-column justify-content-between">
                                        <FaQrcode className="action-icon mb-3" />
                                        <h5>Generate QR Code</h5>
                                        <button className="btn btn-success w-100" onClick={handleGenerateQRCode}>
                                          <FaQrcode className="me-2" /> Generate QR Code
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="col-md-6 col-lg-3">
                                    <div className="card action-card shadow-sm h-100">
                                      <div className="card-body d-flex flex-column justify-content-between">
                                        <FaQrcode className="action-icon mb-3" />
                                        <h5>Download QR Code</h5>
                                        <button className="btn btn-dark w-100" onClick={handleDownloadQRCode}>
                                          <FaQrcode className="me-2" /> Download QR Code
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
          
                            <div className="col-md-6 col-lg-3">
                              <div className="card action-card shadow-sm h-100">
                                <div className="card-body d-flex flex-column justify-content-between">
                                  <FaTrash className="action-icon mb-3" />
                                  <h5>Delete Restaurant</h5>
                                  <button className="btn btn-danger w-100" onClick={handleDelete}>
                                    <FaTrash className="me-2" /> Delete Restaurant 
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
    );
};

export default RestaurantDashboard;
