import React from 'react';
import { X, Lock, Unlock } from 'lucide-react';
import './Header.css';

const Header = ({ isPinned, onTogglePin }) => {
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
          onClick={onTogglePin}
          className={`pin-button ${isPinned ? 'pinned' : ''}`}
          title={isPinned ? 'Unpin extension' : 'Pin extension'}
        >
          {isPinned ? (
            <Lock className="control-icon pin-icon" />
          ) : (
            <Unlock className="control-icon pin-icon" />
          )}
        </button>
        <X className="control-icon control-close" />
      </div>
    </div>
  );
};

export default Header;
