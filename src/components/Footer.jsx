
import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container mx-auto footer-content">
        <div className="footer-section">
          <h3>Silicon Valley Pathology Laboratory</h3>
          <p>1234 Science Drive</p>
          <p>San Jose, CA 95123</p>
          <p>Phone: (555) 123-4567</p>
          <p>Email: info@svpathlab.com</p>
        </div>
        
        <div className="footer-section">
          <h3>Laboratory Hours</h3>
          <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
          <p>Saturday: 9:00 AM - 1:00 PM</p>
          <p>Sunday: Closed</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/daily-qc">Daily QC</a></li>
            <li><a href="/stains">Stain Library</a></li>
          </ul>
        </div>
      </div>
      <div className="copyright">
        <p>&copy; {currentYear} Silicon Valley Pathology Laboratory. All rights reserved.</p>
        <p>Designed by <a href="https://lovable.ai" target="_blank" rel="noopener noreferrer">Lovable AI</a></p>
      </div>
    </footer>
  );
};

export default Footer;
