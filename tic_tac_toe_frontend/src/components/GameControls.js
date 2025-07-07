import React from 'react';

// PUBLIC_INTERFACE
const GameControls = ({ onModeSelect, onReset, currentMode }) => {
  return (
    <div className="game-controls">
      <div className="mode-selection">
        <button 
          className={`mode-button ${currentMode === 'pvp' ? 'active' : ''}`}
          onClick={() => onModeSelect('pvp')}
        >
          Player vs Player
        </button>
        <button 
          className={`mode-button ${currentMode === 'ai' ? 'active' : ''}`}
          onClick={() => onModeSelect('ai')}
        >
          Player vs AI
        </button>
      </div>
      <button className="reset-button" onClick={onReset}>
        Reset Game
      </button>
    </div>
  );
};

export default GameControls;
