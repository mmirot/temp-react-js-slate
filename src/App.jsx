
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

// Check if we have a valid Clerk key
const hasValidClerkKey = () => {
  const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  return key && key !== 'placeholder_for_dev';
};

function App() {
  return (
    <Router>
      {/* Only use ClerkAuthProvider if we have a valid key */}
      {hasValidClerkKey() ? (
        <ClerkAuthProvider>
          <AppContent />
        </ClerkAuthProvider>
      ) : (
        <AppContent />
      )}
    </Router>
  );
}

// Separate the app content to avoid duplication
function AppContent() {
  return (
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
  );
}

export default App;
