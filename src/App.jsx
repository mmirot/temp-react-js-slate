import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StainQCForm from './components/StainQCForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Pathology Stain QC Tracking</h1>
          <Routes>
            <Route path="/" element={<StainQCForm />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}