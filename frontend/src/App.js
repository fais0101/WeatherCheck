import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import RecordsPage from './pages/RecordsPage';
import './App.css';

function App() {
  return (

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/records" element={<RecordsPage />} />
      </Routes>
 
  );
}

export default App;
