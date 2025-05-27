
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import StainQCForm from './components/StainQCForm';
import StainList from './components/StainList';
import NonGynForm from './components/NonGynForm';
import Auth from './pages/Auth';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/Footer';
import './App.css';

function App() {
  // Check if we're in the Lovable preview environment without a Clerk key
  const isLovablePreview = window.location.hostname.includes('lovable.app') || 
                           window.location.hostname.includes('localhost');
  const hasClerkKey = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const showDemoMode = isLovablePreview && !hasClerkKey;

  return (
    <Router>
      <div className="App">
        <Toaster position="top-right" />
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/daily-qc" element={<StainQCForm />} />
            <Route path="/stains" element={<StainList />} />
            <Route path="/non-gyn-tracking" element={<NonGynForm />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
