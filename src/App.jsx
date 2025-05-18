import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import StainQCForm from './components/StainQCForm';
import StainList from './components/StainList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster position="top-right" />
        <header className="App-header">
          <h1>Daily Stain QC</h1>
          <nav className="nav-links">
            <Link to="/stains">View All Stains</Link>
          </nav>
          <Routes>
            <Route path="/" element={<StainQCForm />} />
            <Route path="/stains" element={<StainList />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App