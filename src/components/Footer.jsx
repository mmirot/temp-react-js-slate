
import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="wpa-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Silicon Valley Pathology</h3>
            <p>3400 W Bayshore Rd</p>
            <p>Palo Alto, CA 94303</p>
            <p>Phone: (650) 853-2525</p>
            <p>Fax: (650) 853-2545</p>
            <p>Emergency: (650) 853-STAT</p>
          </div>
          
          <div className="footer-section">
            <h3>Laboratory Hours</h3>
            <p>Monday - Friday: 7:00 AM - 6:00 PM</p>
            <p>Saturday: 8:00 AM - 2:00 PM</p>
            <p>Sunday: Closed</p>
            <p>Emergency Services: 24/7</p>
          </div>
          
          <div className="footer-section">
            <h3>Services</h3>
            <ul>
              <li><a href="#services">Surgical Pathology</a></li>
              <li><a href="#services">Cytopathology</a></li>
              <li><a href="#services">Molecular Pathology</a></li>
              <li><a href="#services">Immunohistochemistry</a></li>
              <li><a href="#services">Digital Pathology</a></li>
              <li><a href="#services">Telepathology</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="/daily-qc">Lab Portal</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} Silicon Valley Pathology. All rights reserved.</p>
          <p>Powered by <a href="https://lovable.ai" target="_blank" rel="noopener noreferrer">Lovable AI</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
