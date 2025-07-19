// services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
});

export const api = {
  // Auth endpoints
  login: (email, password) => {
    // FastAPI OAuth2PasswordRequestForm expects form data, not JSON
    const formData = new URLSearchParams();
    formData.append('username', email); // OAuth2 expects 'username' field
    formData.append('password', password);
    
    return axiosInstance.post('/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
  },
  
  register: (email, password) => 
    axiosInstance.post('/register', { email, password }),
  
  // Itinerary endpoints
  generateItinerary: (data, token) =>
    axiosInstance.post('/api/itinerary/generate', data, {
      headers: { Authorization: `Bearer ${token}` }
    }),
    
  saveItinerary: (data, token) => 
    axiosInstance.post('/api/itinerary', data, {
      headers: { Authorization: `Bearer ${token}` }
    }),
    
  getItineraries: (token) => 
    axiosInstance.get('/api/itinerary', {
      headers: { Authorization: `Bearer ${token}` }
    }),
    
  updateItinerary: (id, data, token) =>
    axiosInstance.patch(`/api/itinerary/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  deleteItinerary: (id, token) =>
    axiosInstance.delete(`/api/itinerary/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
};