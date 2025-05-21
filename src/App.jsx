
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import StainQCForm from './components/StainQCForm';
import StainList from './components/StainList';
import Auth from './pages/Auth';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Toaster position="top-right" />
          <Navbar />
          <div className="container mx-auto p-4">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/" 
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
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
