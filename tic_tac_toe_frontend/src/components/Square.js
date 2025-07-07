import React from 'react';

// PUBLIC_INTERFACE
const Square = ({ value, onClick }) => {
  const getSymbolColor = () => {
    return value === 'X' ? '#00ff00' : '#ff00ff';
  };

  return (
    <button 
      className="square" 
      onClick={onClick}
      disabled={value !== null}
      style={{
        color: value ? getSymbolColor() : 'inherit',
        textShadow: value ? `0 0 10px ${getSymbolColor()}` : 'none'
      }}
    >
      {value}
    </button>
  );
};

export default Square;
