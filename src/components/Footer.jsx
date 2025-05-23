
import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container mx-auto footer-content">
        <div className="footer-section">
          <h3>Medical Labs Inc.</h3>
          <p>1234 Medical Center Drive</p>
          <p>San Francisco, CA 94102</p>
          <p>Phone: (555) 123-4567</p>
          <p>Fax: (555) 123-4568</p>
          <p>Emergency: (555) 123-STAT</p>
        </div>
        
        <div className="footer-section">
          <h3>Laboratory Hours</h3>
          <p>Monday - Friday: 6:00 AM - 10:00 PM</p>
          <p>Saturday: 7:00 AM - 6:00 PM</p>
          <p>Sunday: 8:00 AM - 4:00 PM</p>
          <p>Emergency Services: 24/7</p>
        </div>
        
        <div className="footer-section">
          <h3>Services</h3>
          <ul>
            <li><a href="#services">Clinical Chemistry</a></li>
            <li><a href="#services">Hematology</a></li>
            <li><a href="#services">Microbiology</a></li>
            <li><a href="#services">Molecular Diagnostics</a></li>
            <li><a href="#services">Immunology</a></li>
            <li><a href="#services">Blood Banking</a></li>
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
      <div className="copyright">
        <p>&copy; {currentYear} Medical Labs Inc. All rights reserved.</p>
        <p>Designed by <a href="https://lovable.ai" target="_blank" rel="noopener noreferrer">Lovable AI</a></p>
      </div>
    </footer>
  );
};

export default Footer;
