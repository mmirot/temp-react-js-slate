
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

  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="hero-main">
        <div className="hero-content">
          <h1>Leading Medical Laboratory Services</h1>
          <p className="hero-subtitle">
            Advanced diagnostic solutions with precision, reliability, and excellence in patient care
          </p>
          <div className="hero-buttons">
            {showDemoMode ? (
              <Link to="/daily-qc" className="btn-primary">
                Access Lab Portal (Demo)
              </Link>
            ) : (
              <a href="https://svpathlab.com/daily-qc" className="btn-primary">
                Lab Portal Login
              </a>
            )}
            <Link to="#services" className="btn-secondary">
              Our Services
            </Link>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="section-container">
          <h2>Comprehensive Laboratory Services</h2>
          <p className="section-subtitle">
            State-of-the-art diagnostic testing with rapid turnaround times and accurate results
          </p>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🔬</div>
              <h3>Clinical Chemistry</h3>
              <p>Complete metabolic panels, cardiac markers, and specialized chemistry testing with automated analyzers.</p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">🧪</div>
              <h3>Hematology</h3>
              <p>Complete blood counts, coagulation studies, and advanced hematological testing procedures.</p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">🦠</div>
              <h3>Microbiology</h3>
              <p>Bacterial cultures, sensitivity testing, and rapid identification of infectious agents.</p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">🧬</div>
              <h3>Molecular Diagnostics</h3>
              <p>PCR testing, genetic analysis, and advanced molecular pathology services.</p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">📊</div>
              <h3>Immunology</h3>
              <p>Autoimmune testing, allergy panels, and specialized immunological assays.</p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">🩸</div>
              <h3>Blood Banking</h3>
              <p>Blood typing, crossmatching, and compatibility testing for transfusion medicine.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="section-container">
          <div className="about-grid">
            <div className="about-content">
              <h2>Excellence in Laboratory Medicine</h2>
              <p>
                With over 25 years of experience in diagnostic testing, Medical Labs Inc. has established 
                itself as a trusted partner in healthcare. Our commitment to accuracy, reliability, and 
                innovation drives everything we do.
              </p>
              <p>
                We serve healthcare providers, hospitals, and clinics throughout the region with 
                comprehensive laboratory services, ensuring rapid turnaround times and precise results 
                that healthcare professionals can trust.
              </p>
              
              <div className="stats-grid">
                <div className="stat-item">
                  <h3>50,000+</h3>
                  <p>Tests Performed Monthly</p>
                </div>
                <div className="stat-item">
                  <h3>99.8%</h3>
                  <p>Accuracy Rate</p>
                </div>
                <div className="stat-item">
                  <h3>24/7</h3>
                  <p>Emergency Services</p>
                </div>
              </div>
            </div>
            
            <div className="about-image">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop" 
                alt="Laboratory technician working with modern equipment"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="features-section">
        <div className="section-container">
          <h2>Why Choose Medical Labs Inc.</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Rapid Turnaround</h3>
              <p>Most routine tests completed within 24 hours with STAT options available.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Precision Testing</h3>
              <p>State-of-the-art equipment and rigorous quality control ensure accurate results.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👨‍⚕️</div>
              <h3>Expert Team</h3>
              <p>Board-certified pathologists and experienced laboratory professionals.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>HIPAA Compliant</h3>
              <p>Secure handling of patient information with full regulatory compliance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="section-container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Contact Information</h2>
              <div className="contact-item">
                <h3>Main Laboratory</h3>
                <p>1234 Medical Center Drive<br />
                   San Francisco, CA 94102</p>
                <p>Phone: (555) 123-4567<br />
                   Fax: (555) 123-4568</p>
              </div>
              
              <div className="contact-item">
                <h3>Laboratory Hours</h3>
                <p>Monday - Friday: 6:00 AM - 10:00 PM<br />
                   Saturday: 7:00 AM - 6:00 PM<br />
                   Sunday: 8:00 AM - 4:00 PM</p>
              </div>
              
              <div className="contact-item">
                <h3>Emergency Services</h3>
                <p>24/7 STAT testing available<br />
                   Emergency Line: (555) 123-STAT</p>
              </div>
            </div>
            
            <div className="contact-form">
              <h3>Request Information</h3>
              <form>
                <div className="form-group">
                  <input type="text" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Email Address" required />
                </div>
                <div className="form-group">
                  <input type="tel" placeholder="Phone Number" />
                </div>
                <div className="form-group">
                  <select required>
                    <option value="">Select Service Interest</option>
                    <option value="clinical-chemistry">Clinical Chemistry</option>
                    <option value="hematology">Hematology</option>
                    <option value="microbiology">Microbiology</option>
                    <option value="molecular">Molecular Diagnostics</option>
                    <option value="other">Other Services</option>
                  </select>
                </div>
                <div className="form-group">
                  <textarea placeholder="Message" rows="4"></textarea>
                </div>
                <button type="submit" className="btn-primary">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
