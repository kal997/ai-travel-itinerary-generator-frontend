import React, { useState } from 'react';
import { api } from '../services/api';

function ItineraryForm({ token, onItineraryCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    start_date: '',
    end_date: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.createItinerary(formData, token);
      onItineraryCreated(response.data);
      setFormData({ 
        title: '',
        destination: '',
        start_date: '',
        end_date: '',
        description: ''
      });
    } catch (error) {
      alert('Failed to create itinerary: ' + (error.response?.data?.detail || 'Unknown error'));
    }

    setLoading(false);
  };

  return (
    <div className="itinerary-form-container">
      <h3>Create New Itinerary</h3>
      <form onSubmit={handleSubmit} className="itinerary-form">
        <input
          type="text"
          name="title"
          placeholder="Trip Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={formData.destination}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Trip Description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Itinerary'}
        </button>
      </form>
    </div>
  );
}

export default ItineraryForm;
