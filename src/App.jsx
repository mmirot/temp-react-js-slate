
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import StainQCForm from './components/StainQCForm';
import StainList from './components/StainList';
import Auth from './pages/Auth';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  const [supabseConnected, setSupabaseConnected] = useState(true);

  useEffect(() => {
    // Check if Supabase env variables are missing
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setSupabaseConnected(false);
      toast.error(
        'Supabase connection not configured. Please click the "Connect to Supabase" button in the top right.',
        { duration: 10000 }
      );
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Toaster position="top-right" />
          <Navbar />
          {!supabseConnected && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
              <p className="font-bold">Supabase Not Connected</p>
              <p>
                The application requires a Supabase connection. Please click the "Connect to Supabase" button
                in the top right corner to set up your connection.
              </p>
            </div>
          )}
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
      </AuthProvider>
    </Router>
  );
}

export default App;
