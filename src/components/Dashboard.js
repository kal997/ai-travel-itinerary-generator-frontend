import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

function Dashboard({ token, onLogout }) {
  const [itineraries, setItineraries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form data
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [interests, setInterests] = useState(['']);
  
  // Generated itinerary preview
  const [generatedData, setGeneratedData] = useState(null);
  
  // Selected/editing itinerary
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadItineraries();
  }, []);

  const loadItineraries = async () => {
    try {
      const response = await api.getItineraries(token);
      setItineraries(response.data);
    } catch (error) {
      console.error('Failed to load itineraries:', error);
    }
    setLoading(false);
  };

  const addInterest = () => {
    setInterests([...interests, '']);
  };

  const removeInterest = (index) => {
    if (interests.length > 1) {
      setInterests(interests.filter((_, i) => i !== index));
    }
  };

  const updateInterest = (index, value) => {
    const updated = [...interests];
    updated[index] = value;
    setInterests(updated);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setGeneratedData(null);
    
    const filteredInterests = interests.filter(i => i.trim());
    
    try {
      const response = await api.generateItinerary({
        destination,
        start_date: startDate,
        end_date: endDate,
        interests: filteredInterests
      }, token);
      
      setGeneratedData(response.data);
    } catch (error) {
      alert('Failed to generate itinerary');
    }
    setGenerating(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const filteredInterests = interests.filter(i => i.trim());
    
    try {
      if (editingId) {
        await api.updateItinerary(editingId, {
          destination,
          start_date: startDate,
          end_date: endDate,
          interests: filteredInterests,
          days_count: generatedData.days_count,
          generated_itinerary: generatedData.itinerary
        }, token);
      } else {
        await api.saveItinerary({
          destination,
          start_date: startDate,
          end_date: endDate,
          interests: filteredInterests,
          days_count: generatedData.days_count,
          generated_itinerary: generatedData.itinerary
        }, token);
      }
      
      await loadItineraries();
      resetForm();
      setShowForm(false);
    } catch (error) {
      alert('Failed to save itinerary');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this itinerary?')) return;
    
    try {
      await api.deleteItinerary(id, token);
      await loadItineraries();
      if (selectedItinerary?.id === id) {
        setSelectedItinerary(null);
      }
    } catch (error) {
      alert('Failed to delete itinerary');
    }
  };

  const handleEdit = (itinerary) => {
    setDestination(itinerary.destination);
    setStartDate(itinerary.start_date);
    setEndDate(itinerary.end_date);
    setInterests(itinerary.interests.length > 0 ? itinerary.interests : ['']);
    setEditingId(itinerary.id);
    setGeneratedData(null);
    setShowForm(true);
    setSelectedItinerary(null);
  };

  const resetForm = () => {
    setDestination('');
    setStartDate('');
    setEndDate('');
    setInterests(['']);
    setGeneratedData(null);
    setEditingId(null);
  };

  const viewItinerary = (itinerary) => {
    setSelectedItinerary(itinerary);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Loading your itineraries...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Your Travel Itineraries</h2>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            setSelectedItinerary(null);
            if (!showForm) resetForm();
          }}
          className="create-btn"
        >
          {showForm ? 'Cancel' : '+ Create New Itinerary'}
        </button>
      </div>

      {showForm && (
        <div className="itinerary-form-container">
          <h3>{editingId ? 'Edit Itinerary' : 'Create New Itinerary'}</h3>
          <form onSubmit={handleGenerate} className="itinerary-form">
            <div className="form-group">
              <label>Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., Paris, France"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Interests</label>
              <div className="interests-container">
                {interests.map((interest, index) => (
                  <div key={index} className="interest-item">
                    <input
                      type="text"
                      value={interest}
                      onChange={(e) => updateInterest(index, e.target.value)}
                      placeholder="e.g., museums, food, architecture"
                    />
                    {interests.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInterest(index)}
                        className="icon-btn remove"
                        aria-label="Remove interest"
                      >
                        −
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addInterest}
                  className="icon-btn add"
                  aria-label="Add interest"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="action-buttons">
              <button type="submit" disabled={generating}>
                {generating ? 'Generating...' : 'Generate Itinerary'}
              </button>
              <button 
                type="button" 
                onClick={handleSave}
                disabled={!generatedData || saving}
                className="save-btn"
              >
                {saving ? 'Saving...' : 'Save Itinerary'}
              </button>
            </div>
          </form>
          
          {generatedData && (
            <div className="generated-preview">
              <h3>Generated Itinerary Preview</h3>
              <p><strong>Duration:</strong> {generatedData.days_count} days</p>
              <div className="itinerary-days">
                {generatedData.itinerary.map((day, index) => (
                  <div key={index} className="day-section">
                    <h4 className="day-header">Day {day.day}</h4>
                    <div className="activities">
                      {day.activities.map((activity, actIndex) => (
                        <div key={actIndex} className="activity">
                          {activity}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!showForm && selectedItinerary && (
        <div className="itinerary-detail">
          <div className="detail-header">
            <h3>{selectedItinerary.destination}</h3>
            <div className="detail-actions">
              <button onClick={() => handleEdit(selectedItinerary)} className="edit-btn">
                Edit
              </button>
              <button onClick={() => handleDelete(selectedItinerary.id)} className="delete-btn">
                Delete
              </button>
              <button onClick={() => setSelectedItinerary(null)} className="close-btn">
                Close
              </button>
            </div>
          </div>
          <p><strong>Dates:</strong> {selectedItinerary.start_date} to {selectedItinerary.end_date}</p>
          <p><strong>Duration:</strong> {selectedItinerary.days_count} days</p>
          <p><strong>Interests:</strong> {selectedItinerary.interests.join(', ')}</p>
          <div className="itinerary-days">
            {selectedItinerary.generated_itinerary.map((day, index) => (
              <div key={index} className="day-section">
                <h4 className="day-header">Day {day.day}</h4>
                <div className="activities">
                  {day.activities.map((activity, actIndex) => (
                    <div key={actIndex} className="activity">
                      {activity}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!showForm && !selectedItinerary && (
        <div className="itineraries-grid">
          {itineraries.length === 0 ? (
            <div className="empty-state">
              <h3>No itineraries yet</h3>
              <p>Create your first travel itinerary to get started!</p>
            </div>
          ) : (
            itineraries.map((itinerary) => (
              <div 
                key={itinerary.id} 
                className="itinerary-card"
                onClick={() => viewItinerary(itinerary)}
              >
                <h3>{itinerary.destination}</h3>
                <p><strong>Dates:</strong> {itinerary.start_date} to {itinerary.end_date}</p>
                <p><strong>Duration:</strong> {itinerary.days_count} days</p>
                <p><strong>Interests:</strong> {itinerary.interests.join(', ')}</p>
                <div className="card-actions">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(itinerary);
                    }}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(itinerary.id);
                    }}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;