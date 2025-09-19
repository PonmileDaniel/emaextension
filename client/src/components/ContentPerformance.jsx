import React from 'react';
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react';
import './ContentPerformance.css';

const ContentPerformance = ({ 
  topPerforming, 
  lowestPerforming, 
  isExpanded, 
  onToggle 
}) => {
  return (
    <div className="content-performance">
      <button
        onClick={onToggle}
        className="performance-header"
      >
        <div className="performance-header-content">
          <TrendingUp className="performance-icon icon-trending" />
          <span className="performance-title">Content Performance Analysis</span>
        </div>
        {isExpanded ? 
          <ChevronUp className="chevron-icon" /> : 
          <ChevronDown className="chevron-icon" />
        }
      </button>
      
      {isExpanded && (
        <div className="performance-content">
          {/* Top Performing Content */}
          <div className="performance-section top-section">
            <div className="section-header-mini">
              <TrendingUp className="mini-icon icon-success" />
              <h4 className="section-title-mini">Top Performing Content</h4>
            </div>
            
            <div className="content-list">
              {topPerforming.content.map((content, index) => (
                <div key={index} className="content-item">
                  <div className="content-number success">{index + 1}</div>
                  <div className="content-text">
                    <p className="content-preview">"{content}"</p>
                    <p className="content-reason">
                      <strong>Why it worked:</strong> {topPerforming.whyItWorked[index]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lowest Performing Content */}
          <div className="performance-section bottom-section">
            <div className="section-header-mini">
              <TrendingDown className="mini-icon icon-warning" />
              <h4 className="section-title-mini">Lowest Performing Content</h4>
            </div>
            
            <div className="content-list">
              {lowestPerforming.content.map((content, index) => (
                <div key={index} className="content-item">
                  <div className="content-number warning">{index + 1}</div>
                  <div className="content-text">
                    <p className="content-preview">"{content}"</p>
                    <p className="content-reason">
                      <strong>Why it underperformed:</strong> {lowestPerforming.whyItFailed[index]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentPerformance;