
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [connectionStatus, setConnectionStatus] = useState('unknown');
  const hasClerkKey = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  // Simple connection check
  useEffect(() => {
    const checkConnection = () => {
      if (navigator.onLine) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    };

    checkConnection();
    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);

    return () => {
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
    };
  }, []);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Silicon Valley Pathology Laboratory
        </Link>
        
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            Home
          </Link>
          <Link to="/daily-qc" className={`nav-link ${isActive('/daily-qc')}`}>
            Daily QC
          </Link>
          <Link to="/stains" className={`nav-link ${isActive('/stains')}`}>
            Stain Library
          </Link>
          <Link to="/non-gyn-tracking" className={`nav-link ${isActive('/non-gyn-tracking')}`}>
            Non-Gyn Workload
          </Link>
        </div>

        <div className="auth-nav-buttons">
          {hasClerkKey ? (
            <>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <Link to="/auth" className="sign-in-button">
                  Sign In
                </Link>
              </SignedOut>
            </>
          ) : (
            <Link to="/auth" className="sign-in-button">
              Sign In
            </Link>
          )}
        </div>

        {connectionStatus !== 'connected' && (
          <div className={`preview-indicator ${connectionStatus === 'disconnected' ? 'error' : ''}`}>
            {connectionStatus === 'disconnected' ? 'OFFLINE' : 'DEMO'}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
