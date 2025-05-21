
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
import { AuthProvider } from './context/auth';
import { checkConnection, testConnection } from './lib/supabaseClient';
import './App.css';

function App() {
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(true);

  useEffect(() => {
    // Check if we're in an auth flow by examining URL parameters
    const url = window.location.href;
    const isAuthFlow = url.includes('type=recovery') || 
                       url.includes('type=signup') ||
                       url.includes('error_code=otp_expired');
                       
    if (isAuthFlow) {
      console.log('App - Detected auth flow in URL, delaying initial connection check');
      
      // For auth flows, add a substantial delay before the initial check
      const authFlowCheck = async () => {
        try {
          // Add intentional delay for auth flows
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Then check connection
          const isConnected = await testConnection();
          console.log('App - Auth flow connection check result:', isConnected);
          setSupabaseConnected(isConnected);
          
          if (isConnected) {
            toast.success('Connected to Supabase successfully!');
          } else {
            toast.error(
              'Connection issue detected for auth flow. Please try refreshing the page.',
              { duration: 10000 }
            );
          }
        } catch (error) {
          console.error('Error in auth flow connection check:', error);
          setSupabaseConnected(false);
        } finally {
          setCheckingConnection(false);
        }
      };
      
      authFlowCheck();
      return;
    }
    
    // Check if Supabase env variables are missing
    const hasEnvVars = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!hasEnvVars) {
      setSupabaseConnected(false);
      setCheckingConnection(false);
      toast.error(
        'Supabase connection not configured. Please click the "Connect to Supabase" button in the top right.',
        { duration: 10000 }
      );
      return;
    }
    
    // Test the connection
    const testConnection = async () => {
      try {
        // Add a small delay before testing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const isConnected = await checkConnection();
        console.log('Supabase connection test result:', isConnected);
        setSupabaseConnected(isConnected);
        
        if (isConnected) {
          toast.success('Connected to Supabase successfully!');
        } else {
          toast.error(
            'Failed to connect to Supabase. Please check your credentials or click the "Connect to Supabase" button.',
            { duration: 10000 }
          );
        }
      } catch (error) {
        console.error('Error testing Supabase connection:', error);
        setSupabaseConnected(false);
        toast.error(`Supabase connection error: ${error.message}`, { duration: 10000 });
      } finally {
        setCheckingConnection(false);
      }
    };
    
    testConnection();
    
    // Re-test connection every 5 minutes
    const intervalId = setInterval(testConnection, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Function to manually refresh connection
  const refreshConnection = async () => {
    setCheckingConnection(true);
    
    // Add delay before checking
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const isConnected = await checkConnection();
    setSupabaseConnected(isConnected);
    setCheckingConnection(false);
    
    if (isConnected) {
      toast.success('Supabase connection refreshed successfully!');
    } else {
      toast.error('Failed to connect to Supabase.');
    }
  };

  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Toaster position="top-right" />
          <Navbar />
          {checkingConnection ? (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4" role="alert">
              <p className="font-bold">Checking Supabase Connection...</p>
              <div className="mt-2 flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-500 border-r-2 mr-2"></div>
                <span>Please wait while we verify the connection...</span>
              </div>
            </div>
          ) : !supabaseConnected && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">Supabase Not Connected</p>
                  <p>
                    The application requires a Supabase connection. Please click the "Connect to Supabase" button
                    in the top right corner to set up your connection.
                  </p>
                </div>
                <button 
                  onClick={refreshConnection}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                >
                  Retry Connection
                </button>
              </div>
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
