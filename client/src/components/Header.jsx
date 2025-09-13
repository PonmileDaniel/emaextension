import React from 'react';
import { X } from 'lucide-react';
import './Header.css';

const Header = ({ isPinned, onTogglePin }) => {
  const handleClose = () => {
    window.close();
  }
  return (
    <div className="header">
      <div className="header-brand">
        <div className="brand-icon">
          <span className="brand-letter">E</span>
        </div>
        <span className="brand-name">Ema</span>
      </div>
      <div className="header-controls">
        <button
          onClick={handleClose}
          className="close-button"
          title="Close extension"
        >
          <X className="control-icon control-close" />
        </button>
      </div>
    </div>
  );
};

export default Header;
