import React from 'react';
import { CheckCircle, AlertTriangle, Rocket, ChevronDown, ChevronUp } from 'lucide-react';
import './AuditSection.css';

const AuditSection = ({ 
  type, 
  title, 
  items, 
  isExpanded, 
  onToggle 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'right':
        return <CheckCircle className="section-icon icon-success" />;
      case 'wrong':
        return <AlertTriangle className="section-icon icon-warning" />;
      case 'start':
        return <Rocket className="section-icon icon-primary" />;
      default:
        return null;
    }
  };

  const getBulletClass = () => {
    switch (type) {
      case 'right':
        return 'bullet-success';
      case 'wrong':
        return 'bullet-warning';
      case 'start':
        return 'bullet-primary';
      default:
        return 'bullet-default';
    }
  };

  return (
    <div className="audit-section">
      <button
        onClick={onToggle}
        className="section-header"
      >
        <div className="section-header-content">
          {getIcon()}
          <span className="section-title">{title}</span>
        </div>
        {isExpanded ? 
          <ChevronUp className="chevron-icon" /> : 
          <ChevronDown className="chevron-icon" />
        }
      </button>
      {isExpanded && (
        <div className="section-content">
          <ul className="section-list">
            {items.map((item, index) => (
              <li key={index} className="section-item">
                <div className={`bullet ${getBulletClass()}`}></div>
                <span className="item-text">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AuditSection;
