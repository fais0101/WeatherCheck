import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Weather.css';
import {
  Droplets,
  Thermometer,
  Wind,
  Eye,
  Gauge,
  Sun
} from 'lucide-react';

const Weather = () => {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('current'); // 'current' or 'historical'
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  const MIN_DATE = '2010-01-01'; //earliest date supported by the API
  const TODAY = new Date().toISOString().split('T')[0];

  const getWeather = async (locationData) => {
    setError('');
    setWeather(null);
    setIsLoading(true);

    try {
      const endpoint = activeTab === 'historical' ? 'historical' : 'weather';
      const res = await fetch(`http://localhost:8080/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          location: locationData,
          date: activeTab === 'historical' ? date : undefined,
          end_date: activeTab === 'historical'? endDate: undefined
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to fetch weather');
      } else {
        console.log(data);
        setWeather(data);
        
        // Save to records for both current and historical
        if (activeTab === 'current') {
          await fetch('http://localhost:8080/api/records', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              location: `${data.location.name}, ${data.location.region}, ${data.location.country}`,
              temperature: data.current.temp_f,
              start_date: data.location.localtime,
              notes: 'Current weather search'
            })
          });

          fetchVideos(data.location.name);
        } else {
          // For historical data, save each day as a separate record
          for (const day of data) {
            await fetch('http://localhost:8080/api/records', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                location: day.location,
                temperature: day.avg_temp_f,
                start_date: `${day.date} 00:00:00`,
                notes: `Historical weather for ${day.date}`
              })
            });
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const fetchVideos = async (location) => {
    try{
      const res = await fetch('http://localhost:8080/api/youtube',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({location})
      });

      const data = await res.json();
      if (data.items) {
        setVideos(data.items);
      }

    }catch (err){
      console.error(err)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location.trim()) {
      return;
    }
    
    if (activeTab === 'historical') {
      if (!date) {
        setError('Please select a date for historical weather');
        return;
      }
      if (date < MIN_DATE) {
        setError('Date must be on or after January 1st, 2010');
        return;
      }
      if (date > TODAY) {
        setError('Cannot check weather for future dates');
        return;
      }
    }
    
    getWeather(location);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeather(`${latitude},${longitude}`);
      },
      (error) => {
        setError('Unable to retrieve your location');
        setIsLoading(false);
      }
    );
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setWeather(null);
    setError('');
  };

  return (
    <div className="container">
      <h2>🌤️Weather App</h2>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => handleTabChange('current')}
        >
          Current Weather
        </button>
        <button 
          className={`tab ${activeTab === 'historical' ? 'active' : ''}`}
          onClick={() => handleTabChange('historical')}
        >
          Historical Weather
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Enter city, zip, or coordinates"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="input"
        />
        {activeTab === 'historical' && (
          <>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input date-input"
            min={MIN_DATE}
            max={TODAY}
            placeholder="YYYY-MM-DD"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input date-input"
            min={MIN_DATE}
            max={TODAY}
            placeholder="YYYY-MM-DD"
          />
          </>


        )}
        <div className="button-group">
          <button type="submit" className="button" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Check Weather'}
          </button>
          {activeTab === 'current' && (
            <button 
              type="button" 
              className="button current-location" 
              onClick={getCurrentLocation}
              disabled={isLoading}
            >
              Use Current Location
            </button>
          )}
          <button
            type="button"
            className="button records"
            onClick={() => navigate('/records')}
          >
            📋 View Saved Records
          </button>
          <button
            type="button"
            className="button about"
            onClick={() => navigate('/about')}
          >
            ℹ️ About PM Accelerator
          </button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}

      {weather && activeTab === 'current' && (
        <div className="card">
          <h3>{weather.location.name}, {weather.location.region}, {weather.location.country}</h3>
          <p className="local-time">Local Time: {weather.location.localtime}</p>
          <img 
            src={`https:${weather.current.condition.icon}`} 
            alt="weather icon" 
            className="weather-icon"
          />
          <p className="temp">{weather.current.temp_f.toFixed(1)}°F</p>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{weather.current.condition.text}</p>
          <div className="weather-details">
            <div className="weather-detail">
              <Thermometer size={20} color="white" />
              <span>Feels Like</span>
              <span>{weather.current.feelslike_f}°F</span>
            </div>
            <div className="weather-detail">
              <Droplets size={20} color="white" />
              <span>Humidity</span>
              <span>{weather.current.humidity}%</span>
            </div>
            <div className="weather-detail">
              <Wind size={20} color="white" />
              <span>Wind</span>
              <span>{weather.current.wind_mph} mph {weather.current.wind_dir}</span>
            </div>
            <div className="weather-detail">
              <Gauge size={20} color="white" />
              <span>Pressure</span>
              <span>{weather.current.pressure_in} in</span>
            </div>
            <div className="weather-detail">
              <Eye size={20} color="white" />
              <span>Visibility</span>
              <span>{weather.current.vis_miles} mi</span>
            </div>
            <div className="weather-detail">
              <Sun size={20} color="white" />
              <span>UV Index</span>
              <span>{weather.current.uv}</span>
            </div>
          </div>
        </div>
      )}

      {Array.isArray(weather) && activeTab === 'historical' && (
        <div className="historical-grid">
          {weather.map(day => (
            <div className="card" key={day.date}>
              <h3 style={{ marginBottom: '0.5rem' }}>{day.date}</h3>
              <img src={`https:${day.icon}`} alt="icon" className="weather-icon" />
              <p className="temp">{day.avg_temp_f.toFixed(1)}°F</p>
              <p style={{ fontSize: '1.1rem' }}>{day.condition}</p>
            </div>
          ))}
        </div>
      )}

      {videos.length > 0 && activeTab === 'current' && weather?.location && (
        <div className="video-section">
          <h3>🎥 Explore {weather.location.name}</h3>
          <div className="video-grid">
            {videos.slice(0, 3).map((video) => (
              <iframe
                key={video.id.videoId}
                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                title={video.snippet.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="youtube-embed"
              />
            ))}
          </div>
    </div>
  )}

    </div>
  );
};

export default Weather; 