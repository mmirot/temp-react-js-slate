
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import toast from 'react-hot-toast';

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
  const location = useLocation();
  const [authComponents, setAuthComponents] = useState(MockAuthComponents);
  const [authError, setAuthError] = useState(false);
  const [lastAuthAttempt, setLastAuthAttempt] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check if we're in a production environment
  const isProduction = window.location.hostname === 'svpathlab.com';
  
  // Check if Clerk is available in the global scope
  const hasClerkKey = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  // Only try to import Clerk components if we have a key
  useEffect(() => {
    if (hasClerkKey) {
      try {
        // Log authentication attempt for debugging
        console.log('Attempting to load Clerk components with key available');
        
        // Dynamically import Clerk components using import() instead of require
        import('@clerk/clerk-react').then(({ SignedIn, SignedOut, UserButton }) => {
          setAuthComponents({ SignedIn, SignedOut, UserButton });
          setAuthError(false);
        }).catch(error => {
          console.error('Error importing Clerk components:', error.message);
          setAuthError(true);
          
          // Show error toast only in production and not too frequently
          const now = Date.now();
          if (isProduction && (now - lastAuthAttempt > 10000)) {
            setLastAuthAttempt(now);
            toast.error('Authentication service is not available. Please check your environment setup.');
          }
        });
      } catch (error) {
        console.error('Error setting up Clerk components:', error.message);
        setAuthError(true);
      }
    }
  }, [hasClerkKey, isProduction, lastAuthAttempt]);
  
  const { SignedIn, SignedOut, UserButton } = authComponents;
  
  // Check if we're in the Lovable preview environment
  const isLovablePreview = window.location.hostname.includes('lovable.app') || 
                           window.location.hostname.includes('localhost');
  
  // In preview mode without a key, show demo navigation
  const showDemoNav = (isLovablePreview && !hasClerkKey) || authError;

  // Handler for auth button clicks
  const handleAuthButtonClick = (e) => {
    if (isProduction) {
      if (!hasClerkKey) {
        e.preventDefault();
        toast.error('Authentication is not properly configured. Please set up the environment variables.');
      } else {
        // Redirect to the Daily QC page instead of external auth
        e.preventDefault();
        window.location.href = 'https://svpathlab.com/daily-qc';
      }
    }
  };

  // Handler for navigation link clicks
  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="wpa-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-content">
            <span className="logo-main">Silicon Valley</span>
            <span className="logo-sub">Pathology</span>
          </div>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          
          <a 
            href="#services" 
            className="nav-link"
            onClick={(e) => handleNavClick(e, '#services')}
          >
            Services
          </a>
          
          <a 
            href="#about" 
            className="nav-link"
            onClick={(e) => handleNavClick(e, '#about')}
          >
            About
          </a>
          
          <a 
            href="#contact" 
            className="nav-link"
            onClick={(e) => handleNavClick(e, '#contact')}
          >
            Contact
          </a>
          
          {showDemoNav ? (
            // Demo navigation for preview mode
            <div className="auth-nav-buttons">
              <Link 
                to="/daily-qc" 
                className="lab-portal-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                Lab Portal
              </Link>
            </div>
          ) : (
            // Normal navigation with proper auth state handling
            <>
              {hasClerkKey ? (
                <>
                  <SignedIn>
                    <Link 
                      to="/daily-qc" 
                      className={`nav-link ${location.pathname === '/daily-qc' ? 'active' : ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Daily QC
                    </Link>
                    <Link 
                      to="/stains" 
                      className={`nav-link ${location.pathname === '/stains' ? 'active' : ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Stain Library
                    </Link>
                    <div className="ml-4">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </SignedIn>
                  
                  <SignedOut>
                    <div className="auth-nav-buttons">
                      <a 
                        href="https://svpathlab.com/daily-qc"
                        className="lab-portal-btn"
                        onClick={handleAuthButtonClick}
                      >
                        Lab Portal
                      </a>
                    </div>
                  </SignedOut>
                </>
              ) : (
                // Fallback links when no clerk key is available
                <div className="auth-nav-buttons">
                  <a 
                    href="https://svpathlab.com/daily-qc"
                    className="lab-portal-btn"
                    onClick={handleAuthButtonClick}
                  >
                    Lab Portal
                  </a>
                </div>
              )}
            </>
          )}
        </div>

        {authError && (
          <div className="error-indicator">Auth Error</div>
        )}

        {isLovablePreview && (
          <div className="preview-indicator">
            {!hasClerkKey ? "Preview Mode (No Auth Key)" : "Preview Mode"}
          </div>
        )}
        
        {isProduction && !hasClerkKey && (
          <div className="preview-indicator error">
            Missing Auth Key
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
