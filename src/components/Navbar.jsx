
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

// Create mock auth components for when Clerk is not available
const MockAuthComponents = {
  SignedIn: ({ children }) => <div className="mock-signed-in">{children}</div>,
  SignedOut: ({ children }) => <div className="mock-signed-out">{children}</div>,
  UserButton: () => (
    <Link to="/auth" className="mock-user-button">
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
        <span>U</span>
      </div>
    </Link>
  )
};

const Navbar = () => {
  // Check if Clerk is available in the global scope
  const hasClerkKey = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  let AuthComponents = MockAuthComponents;
  
  // Only try to import Clerk components if we have a key
  if (hasClerkKey) {
    try {
      // We dynamically import these here to avoid the error when no key is available
      const { SignedIn, SignedOut, UserButton } = require('@clerk/clerk-react');
      AuthComponents = { SignedIn, SignedOut, UserButton };
    } catch (error) {
      console.log('Error importing Clerk components:', error.message);
      // Fall back to mock components
    }
  }

  const { SignedIn, SignedOut, UserButton } = AuthComponents;
  const location = useLocation();
  
  // Check if we're in the Lovable preview environment
  const isLovablePreview = window.location.hostname.includes('lovable.app') || 
                         window.location.hostname.includes('localhost');
  
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
            // Normal navigation with proper auth state handling
            <>
              {hasClerkKey ? (
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
              ) : (
                // Fallback links when no clerk key is available
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
                      Sign In
                    </Link>
                  </div>
                </>
              )}
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
