
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { UserButton } from '@clerk/clerk-react';
import './Navbar.css';

const Navbar = () => {
  // Get the auth context safely with fallback values
  const auth = useAuth();
  const user = auth?.user || null;
  const signOut = auth?.signOut || (() => {});
  const location = useLocation();
  
  // Check if Clerk key is available to determine if auth features should be shown
  const clerkKeyAvailable = (() => {
    const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    return key && key !== 'placeholder_for_dev';
  })();

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
          
          {user && clerkKeyAvailable ? (
            <>
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
              <button 
                onClick={signOut} 
                className="sign-out-button"
              >
                Sign Out
              </button>
              <div className="ml-4">
                <UserButton afterSignOutUrl="/auth" />
              </div>
              {user.emailAddresses && (
                <span className="user-email">{user.emailAddresses[0]?.emailAddress}</span>
              )}
            </>
          ) : (
            clerkKeyAvailable && (
              <Link 
                to="/auth" 
                className="sign-in-button"
              >
                Sign In
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
