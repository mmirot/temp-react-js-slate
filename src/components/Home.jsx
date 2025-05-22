import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

// Create mock auth components for when Clerk is not available
const MockAuthComponents = {
  SignedIn: ({ children }) => <div className="mock-signed-in">{children}</div>,
  SignedOut: ({ children }) => <div className="mock-signed-out">{children}</div>,
};

const Home = () => {
  // State to hold auth components
  const [authComponents, setAuthComponents] = useState(MockAuthComponents);
  
  // Check if Clerk is available in the global scope
  const hasClerkKey = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  // Only try to import Clerk components if we have a key
  useEffect(() => {
    if (hasClerkKey) {
      try {
        // Dynamically import Clerk components using import() instead of require
        import('@clerk/clerk-react').then(({ SignedIn, SignedOut }) => {
          setAuthComponents({ SignedIn, SignedOut });
        }).catch(error => {
          console.log('Error importing Clerk components:', error.message);
          // Fall back to mock components
        });
      } catch (error) {
        console.log('Error setting up Clerk components:', error.message);
        // Fall back to mock components
      }
    }
  }, [hasClerkKey]);

  const { SignedIn, SignedOut } = authComponents;

  // Check if we're in the Lovable preview environment without a Clerk key
  const isLovablePreview = window.location.hostname.includes('lovable.app') || 
                         window.location.hostname.includes('localhost');
  const isProduction = window.location.hostname === 'svpathlab.com';
  const showDemoMode = isLovablePreview && !hasClerkKey;

  // Handler for auth buttons in production
  const handleAuthClick = (e, isSignUp = false) => {
    if (isProduction && hasClerkKey) {
      e.preventDefault();
      const portalUrl = isSignUp 
        ? 'https://accounts.svpathlab.com/sign-up'
        : 'https://accounts.svpathlab.com/sign-in';
      window.location.href = portalUrl;
    }
  };

  // Determine auth links based on environment
  const getAuthLink = (isSignUp = false) => {
    if (isProduction && hasClerkKey) {
      return isSignUp 
        ? 'https://accounts.svpathlab.com/sign-up'
        : 'https://accounts.svpathlab.com/sign-in';
    } else {
      return isSignUp ? '/auth?sign-up=true' : '/auth';
    }
  };

  return (
    <div className="home-container">
      <header className="hero">
        <div className="hero-content">
          <h1>Silicon Valley Pathology Laboratory</h1>
          <p className="tagline">Providing excellence in pathology diagnostics since 1995</p>
          
          {showDemoMode ? (
            // Demo mode auth buttons
            <div className="auth-buttons">
              <Link to="/auth" className="cta-button">
                Auth Demo
              </Link>
              <Link to="/daily-qc" className="cta-button-secondary ml-4">
                View Daily QC Tool
              </Link>
            </div>
          ) : (
            // Check for auth key and conditionally render
            hasClerkKey ? (
              <>
                <SignedOut>
                  <div className="auth-buttons">
                    <a 
                      href={getAuthLink()} 
                      className="cta-button"
                      onClick={(e) => handleAuthClick(e)}
                    >
                      Sign In To Access Tools
                    </a>
                    <a 
                      href={getAuthLink(true)} 
                      className="cta-button-secondary ml-4"
                      onClick={(e) => handleAuthClick(e, true)}
                    >
                      Create Account
                    </a>
                  </div>
                </SignedOut>
                
                <SignedIn>
                  <Link to="/daily-qc" className="cta-button">
                    Access Daily QC Tool
                  </Link>
                </SignedIn>
              </>
            ) : (
              // No key available, show generic buttons
              <div className="auth-buttons">
                <Link to="/daily-qc" className="cta-button">
                  View Daily QC Tool
                </Link>
                <Link to="/auth" className="cta-button-secondary ml-4">
                  Auth Demo
                </Link>
              </div>
            )
          )}
        </div>
      </header>

      <section className="services">
        <h2>Our Lab Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">🔬</div>
            <h3>Histology</h3>
            <p>Comprehensive tissue processing and staining services.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🧪</div>
            <h3>Immunohistochemistry</h3>
            <p>Advanced staining techniques for accurate diagnoses.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🧬</div>
            <h3>Molecular Pathology</h3>
            <p>Cutting-edge genetic testing and analysis.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">📋</div>
            <h3>Quality Control</h3>
            <p>Rigorous daily quality checks on all staining procedures.</p>
          </div>
        </div>
      </section>

      <section className="about">
        <h2>About Our Laboratory</h2>
        <p>
          Silicon Valley Pathology Laboratory is committed to delivering accurate and timely pathology services
          to healthcare providers throughout the region. Our team of experienced pathologists and technicians
          utilizes state-of-the-art equipment and techniques to ensure the highest quality results.
        </p>
        <p>
          Our laboratory maintains strict quality control protocols, including daily stain quality checks,
          to guarantee reliable and consistent results for our clients.
        </p>
      </section>

      {showDemoMode ? (
        <section className="tools">
          <h2>Laboratory Tools (Demo Mode)</h2>
          <div className="tools-grid">
            <Link to="/daily-qc" className="tool-card">
              <h3>Daily Stain QC</h3>
              <p>Submit and track daily quality control for laboratory stains.</p>
            </Link>
            <Link to="/stains" className="tool-card">
              <h3>Stain Library</h3>
              <p>View the complete catalog of available stains.</p>
            </Link>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
            <p className="font-semibold text-blue-800">Demo Mode Active</p>
            <p className="mt-2 text-sm text-blue-700">
              You are viewing tools in demo mode. Set the VITE_CLERK_PUBLISHABLE_KEY environment variable
              during deployment to enable full authentication features.
            </p>
          </div>
        </section>
      ) : (
        hasClerkKey ? (
          // Authenticated tools section
          <>
            <SignedIn>
              <section className="tools">
                <h2>Laboratory Tools</h2>
                <div className="tools-grid">
                  <Link to="/daily-qc" className="tool-card">
                    <h3>Daily Stain QC</h3>
                    <p>Submit and track daily quality control for laboratory stains.</p>
                  </Link>
                  <Link to="/stains" className="tool-card">
                    <h3>Stain Library</h3>
                    <p>View the complete catalog of available stains.</p>
                  </Link>
                </div>
              </section>
            </SignedIn>
            
            <SignedOut>
              <section className="get-started mt-8 p-6 bg-blue-50 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="mb-4">Sign in to access our laboratory management tools and quality control systems.</p>
                <a 
                  href={getAuthLink()} 
                  className="cta-button inline-block mr-4"
                  onClick={(e) => handleAuthClick(e)}
                >
                  Sign In Now
                </a>
                <a 
                  href={getAuthLink(true)} 
                  className="cta-button-secondary inline-block"
                  onClick={(e) => handleAuthClick(e, true)}
                >
                  Create Account
                </a>
              </section>
            </SignedOut>
          </>
        ) : (
          // No auth available, show regular tools
          <section className="tools">
            <h2>Laboratory Tools</h2>
            <div className="tools-grid">
              <Link to="/daily-qc" className="tool-card">
                <h3>Daily Stain QC</h3>
                <p>Submit and track daily quality control for laboratory stains.</p>
              </Link>
              <Link to="/stains" className="tool-card">
                <h3>Stain Library</h3>
                <p>View the complete catalog of available stains.</p>
              </Link>
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-700">
                Note: Authentication is not enabled. Set the VITE_CLERK_PUBLISHABLE_KEY environment variable
                during deployment to enable authentication features.
              </p>
            </div>
          </section>
        )
      )}
    </div>
  );
};

export default Home;
