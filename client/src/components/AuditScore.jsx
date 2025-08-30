import React from 'react';
import './AuditScore.css';

const AuditScore = ({ score, maxScore, description }) => {
  const getScoreClass = (score) => {
    if (score >= 8) return 'score-excellent';
    if (score >= 5) return 'score-good';
    return 'score-poor';
  };

  return (
    <div className="audit-score">
      <div className="score-header">
        <span className="score-emoji">⭐</span>
        <h3 className="score-title">Overall Score</h3>
      </div>
      <div className="score-content">
        <div className={`score-circle ${getScoreClass(score)}`}>
          <span className="score-number">
            {score}/{maxScore}
          </span>
        </div>
      </div>
      <p className="score-description">{description}</p>
    </div>
  );
};

export default AuditScore;
