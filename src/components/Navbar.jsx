
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import './Navbar.css';

const Navbar = () => {
  // Use try/catch to handle Clerk errors in preview mode
  let isAuthenticated = false;
  let clerkLoaded = false;
  
  try {
    const { userId, isLoaded } = useAuth();
    isAuthenticated = isLoaded && !!userId;
    clerkLoaded = isLoaded;
  } catch (error) {
    console.log('Clerk auth error in Navbar:', error.message);
  }

  const location = useLocation();
  
  // Check if we're in the Lovable preview environment
  const isLovablePreview = window.location.hostname.includes('lovable.app') || 
                         window.location.hostname.includes('localhost');
  
  // Check if Clerk key is available
  const hasClerkKey = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  // In preview mode without a key, show demo navigation
  const showDemoNav = isLovablePreview && !hasClerkKey;

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
          
          {showDemoNav ? (
            // Demo navigation for preview mode
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
              <div className="auth-nav-buttons">
                <Link to="/auth" className="sign-in-button">
                  Auth Demo
                </Link>
              </div>
            </>
          ) : (
            // Normal navigation with Clerk components
            <>
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
                <div className="auth-nav-buttons">
                  <Link to="/auth" className="sign-in-button">
                    Sign In
                  </Link>
                  <Link to="/auth?sign-up=true" className="sign-up-button ml-2">
                    Sign Up
                  </Link>
                </div>
              </SignedOut>
            </>
          )}
        </div>

        {isLovablePreview && (
          <div className="preview-indicator">
            {!hasClerkKey ? "Preview Mode (No Auth Key)" : "Preview Mode"}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
