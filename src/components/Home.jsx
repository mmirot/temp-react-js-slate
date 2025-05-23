
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
    <div className="wpa-home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Advanced Pathology Services for Better Patient Outcomes
            </h1>
            <p className="hero-subtitle">
              Silicon Valley Pathology delivers comprehensive diagnostic services with cutting-edge technology and expert pathologists committed to precision and excellence in patient care.
            </p>
            <div className="hero-actions">
              {showDemoMode ? (
                <Link to="/daily-qc" className="cta-button primary">
                  Access Lab Portal
                </Link>
              ) : (
                <a href="https://svpathlab.com/daily-qc" className="cta-button primary">
                  Lab Portal Login
                </a>
              )}
              <a href="#services" className="cta-button secondary">
                Our Services
              </a>
            </div>
          </div>
          <div className="hero-image">
            <img 
              src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop&crop=center" 
              alt="Pathology Laboratory"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Comprehensive Pathology Services</h2>
            <p>We provide a full spectrum of pathology services with rapid turnaround times and exceptional accuracy</p>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop" alt="Surgical Pathology" />
              </div>
              <h3>Surgical Pathology</h3>
              <p>Expert diagnosis of tissue specimens with subspecialty consultation and comprehensive reporting.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <img src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=100&h=100&fit=crop" alt="Cytopathology" />
              </div>
              <h3>Cytopathology</h3>
              <p>Cervical, non-gynecologic, and fine needle aspiration cytology with rapid screening and diagnosis.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop" alt="Molecular Pathology" />
              </div>
              <h3>Molecular Pathology</h3>
              <p>Advanced molecular diagnostics including PCR, sequencing, and biomarker analysis.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <img src="https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=100&h=100&fit=crop" alt="Immunohistochemistry" />
              </div>
              <h3>Immunohistochemistry</h3>
              <p>Comprehensive IHC panels for cancer diagnosis, prognosis, and therapeutic planning.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <img src="https://images.unsplash.com/photo-1576671081837-49000212a370?w=100&h=100&fit=crop" alt="Digital Pathology" />
              </div>
              <h3>Digital Pathology</h3>
              <p>State-of-the-art digital imaging and AI-assisted diagnosis for enhanced accuracy.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=100&h=100&fit=crop" alt="Telepathology" />
              </div>
              <h3>Telepathology</h3>
              <p>Remote consultation and second opinion services for complex cases worldwide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Leading Pathology Excellence</h2>
              <p>
                Silicon Valley Pathology has been at the forefront of diagnostic medicine for over two decades. 
                Our team of board-certified pathologists and laboratory professionals are committed to providing 
                accurate, timely diagnoses that guide optimal patient care.
              </p>
              <p>
                We combine cutting-edge technology with deep clinical expertise to deliver comprehensive 
                pathology services to hospitals, clinics, and healthcare providers throughout the region.
              </p>
              <div className="stats-container">
                <div className="stat-item">
                  <span className="stat-number">25+</span>
                  <span className="stat-label">Years of Excellence</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">100K+</span>
                  <span className="stat-label">Cases Annually</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">99.8%</span>
                  <span className="stat-label">Accuracy Rate</span>
                </div>
              </div>
            </div>
            <div className="about-image">
              <img 
                src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=400&fit=crop" 
                alt="Silicon Valley Pathology Team"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="section-header">
            <h2>Contact Silicon Valley Pathology</h2>
            <p>Get in touch with our team for pathology services and consultation</p>
          </div>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <h3>Main Laboratory</h3>
                <p>3400 W Bayshore Rd<br />
                   Palo Alto, CA 94303</p>
                <p>Phone: (650) 853-2525<br />
                   Fax: (650) 853-2545</p>
              </div>
              <div className="contact-item">
                <h3>Laboratory Hours</h3>
                <p>Monday - Friday: 7:00 AM - 6:00 PM<br />
                   Saturday: 8:00 AM - 2:00 PM<br />
                   Emergency Services: 24/7</p>
              </div>
              <div className="contact-item">
                <h3>Emergency Services</h3>
                <p>24/7 STAT services available<br />
                   Emergency Line: (650) 853-STAT</p>
              </div>
            </div>
            <div className="contact-form">
              <h3>Request Information</h3>
              <form>
                <div className="form-row">
                  <input type="text" placeholder="Name" required />
                  <input type="email" placeholder="Email" required />
                </div>
                <div className="form-row">
                  <input type="tel" placeholder="Phone" />
                  <select required>
                    <option value="">Service Interest</option>
                    <option value="surgical">Surgical Pathology</option>
                    <option value="cyto">Cytopathology</option>
                    <option value="molecular">Molecular Pathology</option>
                    <option value="consultation">Consultation</option>
                  </select>
                </div>
                <textarea placeholder="Message" rows="4"></textarea>
                <button type="submit" className="submit-btn">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
