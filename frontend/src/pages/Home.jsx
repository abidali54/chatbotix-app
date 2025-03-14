import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">chatbotix</Link>
        </div>
        <div className="nav-links">
          <Link to="/about">About</Link>
          <Link to="/features">Features</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/docs">Documentation</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/register" className="register-btn">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Next-Gen AI Customer Support Platform</h1>
          <p>Enhance your customer experience with our intelligent chatbot solution</p>
          <div className="hero-buttons">
            <Link to="/register" className="primary-btn">let's create</Link>
            <Link to="/demo" className="secondary-btn">Watch Demo</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Powerful Features to Transform Your Business</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Advanced AI Chatbot</h3>
            <ul>
              <li>24/7 intelligent customer support</li>
              <li>Natural language processing</li>
              <li>Multi-language support</li>
              <li>Contextual understanding</li>
              <li>Automated response optimization</li>
            </ul>
          </div>
          <div className="feature-card">
            <h3>Smart Live Chat</h3>
            <ul>
              <li>Seamless AI-to-human handoff</li>
              <li>Real-time visitor monitoring</li>
              <li>Chat history and analytics</li>
              <li>Custom chat workflows</li>
              <li>Team collaboration tools</li>
            </ul>
          </div>
          <div className="feature-card">
            <h3>Comprehensive Analytics</h3>
            <ul>
              <li>Real-time performance metrics</li>
              <li>Customer behavior insights</li>
              <li>Conversion tracking</li>
              <li>Custom report generation</li>
              <li>ROI measurement tools</li>
            </ul>
          </div>
          <div className="feature-card">
            <h3>Seamless Integration</h3>
            <ul>
              <li>Easy platform integration</li>
              <li>API accessibility</li>
              <li>CRM system compatibility</li>
              <li>E-commerce platform support</li>
              <li>Custom webhook support</li>
            </ul>
          </div>
          <div className="feature-card">
            <h3>E-commerce Tools</h3>
            <ul>
              <li>Product recommendations</li>
              <li>Shopping cart assistance</li>
              <li>Order tracking integration</li>
              <li>Inventory management</li>
              <li>Payment processing support</li>
            </ul>
          </div>
          <div className="feature-card">
            <h3>Customer Engagement</h3>
            <ul>
              <li>Personalized interactions</li>
              <li>Automated follow-ups</li>
              <li>Customer feedback system</li>
              <li>Loyalty program integration</li>
              <li>Email marketing automation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Ready to Transform Your Customer Support?</h2>
        <p>Join thousands of companies already using Chatbotix</p>
        <Link to="/register" className="cta-btn">Get Started Now</Link>
      </section>
    </div>
  );
};

export default Home;