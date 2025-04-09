import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import RecordsPage from './pages/Records/RecordsPage';
import About from './components/About/About';
import './App.css';

function App() {
  return (
    
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>

  );
}

export default App;
