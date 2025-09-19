import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, BarChart3, Target, Zap, Shield, CheckCircle, ArrowRight, Twitter, TrendingUp, Users, MessageSquare } from 'lucide-react';
import "./landpage.css";

function landpage({ onNavigateToAudit }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: BarChart3,
      title: "Profile Analysis",
      description: "Get comprehensive insights into your X profile optimization and performance metrics"
    },
    {
      icon: Target,
      title: "Content Strategy",
      description: "Analyze your tweet performance, engagement patterns, and optimal content types"
    },
    {
      icon: TrendingUp,
      title: "Growth Opportunities",
      description: "Discover personalized recommendations to increase your reach and engagement"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get your complete X audit in just 30 seconds with actionable next steps"
    }
  ];

  const benefits = [
    "Complete profile and content analysis",
    "Personalized growth recommendations", 
    "Engagement optimization insights",
    "Best posting time suggestions"
  ];

  const extensionFeatures = [
    "Easy one-click installation",
    "Works directly in your browser",
    "No need to leave X/Twitter",
    "Instant analysis while browsing"
  ];

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-content">
          <div className="logo-section">
            <div className="logo-icon">
              <span>E</span>
            </div>
            <span className="brand-name">Ema</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-blur hero-blur-1"></div>
          <div className="hero-blur hero-blur-2"></div>
        </div>
        
        <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
          <h1 className="hero-title">
            Optimize Your X Strategy
            <br />
            <span className="hero-title-gradient">
              with Our Browser Extension
            </span>
          </h1>
          
          <p className="hero-description">
            Install our Chrome extension and get instant X account audits while browsing. 
            Analyze your profile, content performance, and get growth recommendations directly in your browser.
          </p>

          {/* Main CTA */}
          <div className="hero-cta-section">
            <button
              onClick={onNavigateToAudit}
              className="hero-cta-btn"
            >
              <span>Install Extension</span>
            </button>
            <p className="hero-cta-note">Free Chrome Extension • No signup required</p>
          </div>

          {/* Trust Indicators */}
          <div className="trust-indicators">
            <div className="trust-item">
              <CheckCircle size={16} />
              <span>Completely free</span>
            </div>
            <div className="trust-item">
              <CheckCircle size={16} />
              <span>No signup required</span>
            </div>
            <div className="trust-item">
              <CheckCircle size={16} />
              <span>Instant results</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-header">
          <h2 className="features-title">
            What Ema Analyzes for You
          </h2>
          <p className="features-description">
            Get comprehensive insights across every aspect of your X presence
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <Icon size={24} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="how-it-works-header">
          <h2 className="how-it-works-title">
            Get Your Audit in 3 Simple Steps
          </h2>
        </div>

        <div className="steps-grid">
          {[
            { step: "1", title: "Install Extension", desc: "Add Ema to Chrome - takes just one click" },
            { step: "2", title: "Visit X/Twitter", desc: "Browse X normally with the extension active" },
            { step: "3", title: "Get Instant Audits", desc: "Click the extension icon to analyze any profile" }
          ].map((item, index) => (
            <div key={index} className="step-item">
              <div className="step-number">
                {item.step}
              </div>
              <h3 className="step-title">{item.title}</h3>
              <p className="step-description">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sample Results Preview */}
      <section className="results-preview-section">
        <div className="results-preview-grid">
          <div className="results-preview-content">
            <h2 className="results-preview-title">
              See What You'll Discover
            </h2>
            <p className="results-preview-description">
              Get specific, actionable insights that show you exactly how to improve your X performance.
            </p>
            
            <div className="benefits-list">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-item">
                  <CheckCircle size={20} />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sample-results">
            <div className="sample-result sample-result-green">
              <div className="sample-result-header">
                <CheckCircle size={20} />
                <span className="sample-result-label">Strength Found</span>
              </div>
              <p>Strong engagement rate of 4.2% (above average for your follower count)</p>
            </div>
            
            <div className="sample-result sample-result-orange">
              <div className="sample-result-header">
                <Target size={20} />
                <span className="sample-result-label">Improvement Opportunity</span>
              </div>
              <p>Posting at non-optimal times - missing 60% of your audience</p>
            </div>
            
            <div className="sample-result sample-result-indigo">
              <div className="sample-result-header">
                <TrendingUp size={20} />
                <span className="sample-result-label">Growth Recommendation</span>
              </div>
              <p>Create more thread content - your threads get 3x more engagement</p>
            </div>
          </div>
        </div>
      </section>

      {/* Extension Benefits Section */}
      <section className="social-proof-section">
        <div className="social-proof-header">
          <h2 className="social-proof-title">
            Why Choose Ema Extension?
          </h2>
          <p className="social-proof-description">Get powerful X insights directly in your browser</p>
        </div>

        <div className="extension-benefits-grid">
          {extensionFeatures.map((feature, index) => (
            <div key={index} className="extension-benefit-card">
              <div className="extension-benefit-icon">
                <CheckCircle size={24} />
              </div>
              <p className="extension-benefit-text">{feature}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="final-cta-card">
          <h2 className="final-cta-title">
            Ready to Unlock Your X Growth Potential?
          </h2>
          <p className="final-cta-description">
            Stop guessing what works. Get data-driven insights in 30 seconds.
          </p>
          
          <div className="final-cta-buttons">
            <button 
              onClick={onNavigateToAudit}
              className="final-cta-primary"
            >
              <span>Install Extension Now</span>
              <ArrowRight size={16} />
            </button>
                        <Link to="/privacy" className="final-cta-secondary">
              Privacy Policy
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <div className="footer-logo-icon">
              <span>E</span>
            </div>
            <span className="footer-brand-name">Ema</span>
          </div>
          
          <div className="footer-copyright">
            <p>&copy; 2025 Ema. All rights reserved.</p>
            <p><Link to="/privacy" style={{color: '#666', textDecoration: 'none'}}>Privacy Policy</Link></p>
          </div>
        </div>
      </footer>
    </div> 
  );
}

export default landpage;