
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import './Navbar.css';

const Navbar = () => {
  const { userId, isLoaded } = useAuth();
  const location = useLocation();
  const isAuthenticated = isLoaded && !!userId;
  
  return (
    <nav className="navbar">
      <div className="container mx-auto navbar-container">
        <Link to="/" className="navbar-logo">
          SV Pathology Lab
        </Link>
        
        <div className="navbar-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          
          <SignedIn>
            <Link 
              to="/daily-qc" 
              className={`nav-link ${location.pathname === '/daily-qc' ? 'active' : ''}`}
            >
              Daily QC
            </Link>
            <Link 
              to="/stains" 
              className={`nav-link ${location.pathname === '/stains' ? 'active' : ''}`}
            >
              Stain Library
            </Link>
            <div className="ml-4">
              <UserButton afterSignOutUrl="/auth" />
            </div>
          </SignedIn>
          
          <SignedOut>
            <Link to="/auth" className="sign-in-button">
              Sign In
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
