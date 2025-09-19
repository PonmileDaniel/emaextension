import React from 'react';
import { Target, TrendingUp, ChevronDown, ChevronUp, Clock, FileText } from 'lucide-react';
import './ContentTopics.css';

const ContentTopics = ({ 
  contentTopics, 
  isExpanded, 
  onToggle 
}) => {
  return (
    <div className="content-topics">
      <button
        onClick={onToggle}
        className="topics-header"
      >
        <div className="topics-header-content">
          <Target className="topics-icon icon-target" />
          <span className="topics-title">Content & Topics That Work</span>
        </div>
        {isExpanded ? 
          <ChevronUp className="chevron-icon" /> : 
          <ChevronDown className="chevron-icon" />
        }
      </button>
      
      {isExpanded && (
        <div className="topics-content">
          {/* Best Performing Topics */}
          <div className="topics-section">
            <div className="section-header-mini">
              <TrendingUp className="mini-icon icon-success" />
              <h4 className="section-title-mini">Your Best Performing Topics</h4>
            </div>
            
            <div className="topics-grid">
              {contentTopics.bestPerforming.map((topic, index) => (
                <div key={index} className="topic-tag success">
                  <span className="topic-number">{index + 1}</span>
                  <span className="topic-text">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Content Recommendations */}
          <div className="topics-section">
            <div className="section-header-mini">
              <FileText className="mini-icon icon-primary" />
              <h4 className="section-title-mini">Recommended Content Types</h4>
            </div>
            
            <div className="recommendations-list">
              {contentTopics.recommendations.map((rec, index) => (
                <div key={index} className="recommendation-item">
                  <div className="rec-bullet primary"></div>
                  <span className="rec-text">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Content Formats */}
          <div className="topics-section">
            <div className="section-header-mini">
              <Target className="mini-icon icon-secondary" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentTopics;