import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Records.css';

const Records = () => {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/records');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch records');
      }
      
      setRecords(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/records/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete record');
      }

      setRecords(records.filter(record => record.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return <div className="records-container">Loading...</div>;
  }

  return (
    <div className="records-container">
      <h2>Weather Records</h2>
      
      <button 
        className="button back-button"
        onClick={() => navigate('/')}
      >
        Back to Weather
      </button>

      {error && <p className="error">{error}</p>}

      {records.length === 0 ? (
        <p className="no-records">No weather records found</p>
      ) : (
        <div className="records-grid">
          {records.map((record) => (
            <div key={record.id} className="record-card">
              <h3>{record.location}</h3>
              <p className="temperature">{record.temperature}°F</p>
              <p className="date">{new Date(record.date).toLocaleDateString()}</p>
              <button 
                className="button delete-button"
                onClick={() => handleDelete(record.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Records; 