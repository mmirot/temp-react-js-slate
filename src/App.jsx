
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import StainQCForm from './components/StainQCForm';
import StainList from './components/StainList';
import Auth from './pages/Auth';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { ClerkAuthProvider } from './context/clerk';
import './App.css';

function App() {
  return (
    <Router>
      <ClerkAuthProvider>
        <div className="App">
          <Toaster position="top-right" />
          <Navbar />
          <div className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/daily-qc" 
                element={
                  <ProtectedRoute>
                    <StainQCForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/stains" 
                element={
                  <ProtectedRoute>
                    <StainList />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </ClerkAuthProvider>
    </Router>
  );
}

export default App;
