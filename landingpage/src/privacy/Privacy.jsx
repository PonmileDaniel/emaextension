import React from 'react';
import { Link } from 'react-router-dom';
import './Privacy.css';

function Privacy() {
  return (
    <div className="privacy-wrapper">
      {/* Animated Background Elements */}
      <div className="background-elements">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      {/* Header Section */}
      <header className="header-section">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">
              <span>E</span>
            </div>
            <span className="brand-name">Ema</span>
          </div>
          <Link to="/" className="back-to-home">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="privacy-card">
          <h1 className="page-title">Privacy Policy</h1>
          <p className="page-subtitle">
            Protecting your privacy while empowering your X/Twitter growth
          </p>

          <div className="section-group">
            {/* Introduction */}
            <section className="policy-section">
              <div className="section-header">
                <div className="section-number">1</div>
                <h2 className="section-title">Introduction</h2>
              </div>
              <div className="section-content">
                <p>
                  Ema Extension ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard information when you use our Chrome browser extension for X (formerly Twitter) profile analysis.
                </p>
              </div>
            </section>

            {/* Information We Collect */}
            <section className="policy-section">
              <div className="section-header">
                <div className="section-number">2</div>
                <h2 className="section-title">Information We Collect</h2>
              </div>
              <div className="section-content">
                <div className="subsection">
                  <h3>Data You Provide</h3>
                  <ul>
                    <li>X/Twitter profile information you choose to analyze</li>
                    <li>Feedback or contact information if you reach out to us</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>Automatically Collected Data</h3>
                  <ul>
                    <li>Basic usage analytics (how often the extension is used)</li>
                    <li>Error logs to improve extension performance</li>
                    <li>Browser version and operating system for compatibility</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>Data We Do NOT Collect</h3>
                  <ul>
                    <li>Your X/Twitter login credentials</li>
                    <li>Private messages or direct messages</li>
                    <li>Personal browsing history outside of X/Twitter</li>
                    <li>Financial or payment information</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="policy-section">
              <div className="section-header">
                <div className="section-number">3</div>
                <h2 className="section-title">How We Use Your Information</h2>
              </div>
              <div className="section-content">
                <p>We use the collected information to:</p>
                <ul>
                  <li>Provide X profile analysis and insights</li>
                  <li>Improve our extension's functionality and user experience</li>
                  <li>Generate anonymized usage statistics</li>
                  <li>Respond to user inquiries and provide support</li>
                  <li>Ensure the extension works properly across different browsers and systems</li>
                </ul>
              </div>
            </section>

            {/* Data Storage and Security */}
            <section className="policy-section">
              <div className="section-header">
                <div className="section-number">4</div>
                <h2 className="section-title">Data Storage and Security</h2>
              </div>
              <div className="section-content">
                <ul>
                  <li><strong>Local Storage:</strong> Most analysis is performed locally in your browser</li>
                  <li><strong>Temporary Processing:</strong> Some data may be temporarily processed on our servers for AI analysis</li>
                  <li><strong>No Long-term Storage:</strong> We do not permanently store your X profile data</li>
                  <li><strong>Encryption:</strong> All data transmission uses industry-standard encryption</li>
                </ul>
              </div>
            </section>

            {/* Data Sharing */}
            <section className="policy-section">
              <div className="section-header">
                <div className="section-number">5</div>
                <h2 className="section-title">Data Sharing</h2>
              </div>
              <div className="section-content">
                <p>We do not sell, trade, or rent your personal information to third parties. We may share data only in these limited circumstances:</p>
                <ul>
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and prevent fraud</li>
                  <li>In aggregated, anonymized form for research purposes</li>
                </ul>
              </div>
            </section>

            {/* Third-Party Services */}
            <section className="policy-section">
              <div className="section-header">
                <div className="section-number">6</div>
                <h2 className="section-title">Third-Party Services</h2>
              </div>
              <div className="section-content">
                <p>Our extension may use third-party services for:</p>
                <ul>
                  <li><strong>AI Analysis:</strong> Google Gemini API for content analysis</li>
                  <li><strong>Analytics:</strong> Basic usage statistics (anonymized)</li>
                </ul>
                <p>These services have their own privacy policies, which we encourage you to review.</p>
              </div>
            </section>

            {/* Your Rights and Choices */}
            <section className="policy-section">
              <div className="section-header">
                <div className="section-number">7</div>
                <h2 className="section-title">Your Rights and Choices</h2>
              </div>
              <div className="section-content">
                <p>You have the right to:</p>
                <ul>
                  <li>Request information about data we have collected about you</li>
                  <li>Request deletion of your data</li>
                  <li>Opt out of analytics collection</li>
                  <li>Uninstall the extension at any time</li>
                </ul>
              </div>
            </section>

            {/* Children's Privacy */}
            <section className="policy-section">
              <div className="section-header">
                <div className="section-number">8</div>
                <h2 className="section-title">Children's Privacy</h2>
              </div>
              <div className="section-content">
                <p>
                  Our extension is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
              </div>
            </section>

            {/* International Users */}
            <section className="policy-section">
              <div className="section-header">
                <div className="section-number">9</div>
                <h2 className="section-title">International Users</h2>
              </div>
              <div className="section-content">
                <p>
                  If you are using our extension from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States where our servers are located.
                </p>
              </div>
            </section>

            {/* Changes to Privacy Policy */}
            <section className="policy-section">
              <div className="section-header">
                <div className="section-number">10</div>
                <h2 className="section-title">Changes to This Privacy Policy</h2>
              </div>
              <div className="section-content">
                <p>
                  We may update this Privacy Policy from time to time. We will notify users of any material changes by updating the "Last Updated" date at the top of this policy. Your continued use of the extension after any modifications indicates your acceptance of the updated Privacy Policy.
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Contact Section */}
        <section className="contact-section">
          <div className="contact-content">
            <h2 className="contact-title">Questions? We're Here to Help</h2>
            <p>If you have any questions about this Privacy Policy or our data practices, don't hesitate to reach out.</p>
            
            <div className="contact-details">
              <div className="contact-item">
                <span>📧</span>
                <span>infoemaaudit@gmail.com</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer-section">
        <p>
          <span className="footer-brand">Ema Extension</span> - Empowering your X/Twitter growth with privacy-first analytics
        </p>
      </footer>
    </div>
  );
}

export default Privacy;
