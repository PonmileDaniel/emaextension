import React from 'react';
import { X, Lock } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <div className="header">
      <div className="header-brand">
        <div className="brand-icon">
          <span className="brand-letter">E</span>
        </div>
        <span className="brand-name">Ema</span>
      </div>
      <div className="header-controls">
        <Lock className="control-icon" />
        <X className="control-icon control-close" />
      </div>
    </div>
  );
};

export default Header;
