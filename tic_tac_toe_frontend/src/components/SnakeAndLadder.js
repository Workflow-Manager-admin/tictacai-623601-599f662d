import React, { useState, useEffect } from 'react';

const BOARD_SIZE = 10;
const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE;

// Snakes and Ladders configuration (start -> end)
const SNAKES = {
  16: 6,
  47: 26,
  49: 11,
  56: 53,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  98: 78
};

const LADDERS = {
  1: 38,
  4: 14,
  9: 31,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  80: 100
};

const SnakeAndLadder = () => {
  const [players, setPlayers] = useState([
    { id: 1, position: 0, color: '#00ff00' },
    { id: 2, position: 0, color: '#ff00ff' }
  ]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceValue, setDiceValue] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [showTitle, setShowTitle] = useState(true);

  useEffect(() => {
    if (showTitle) {
      const timer = setTimeout(() => setShowTitle(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showTitle]);

  const rollDice = () => {
    if (isRolling || gameOver) return;

    setIsRolling(true);
    setMessage('');

    // Animate dice roll
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollCount++;

      if (rollCount >= 10) {
        clearInterval(rollInterval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);
        movePlayer(finalValue);
        setIsRolling(false);
      }
    }, 100);
  };

  const movePlayer = (steps) => {
    const player = players[currentPlayer];
    let newPosition = player.position + steps;

    // Check if player won
    if (newPosition === TOTAL_CELLS) {
      setGameOver(true);
      setMessage(`Player ${currentPlayer + 1} Wins!`);
      return;
    }

    // Bounce back if exceeding board
    if (newPosition > TOTAL_CELLS) {
      newPosition = TOTAL_CELLS - (newPosition - TOTAL_CELLS);
    }

    // Check for snakes
    if (SNAKES[newPosition]) {
      setMessage(`Oops! Snake at ${newPosition}`);
      newPosition = SNAKES[newPosition];
    }

    // Check for ladders
    if (LADDERS[newPosition]) {
      setMessage(`Yay! Ladder at ${newPosition}`);
      newPosition = LADDERS[newPosition];
    }

    // Update player position
    const updatedPlayers = players.map((p, index) =>
      index === currentPlayer ? { ...p, position: newPosition } : p
    );

    setPlayers(updatedPlayers);
    setCurrentPlayer((current) => (current + 1) % players.length);
  };

  const resetGame = () => {
    setPlayers(players.map(p => ({ ...p, position: 0 })));
    setCurrentPlayer(0);
    setDiceValue(null);
    setIsRolling(false);
    setGameOver(false);
    setMessage('');
    setShowTitle(true);
  };

  const renderBoard = () => {
    const cells = [];
    let number = TOTAL_CELLS;

    for (let row = 0; row < BOARD_SIZE; row++) {
      const rowCells = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        const isEvenRow = row % 2 === 0;
        const position = isEvenRow ? 
          number - col : 
          number - BOARD_SIZE + 1 + col;

        rowCells.push(
          <div 
            key={position} 
            className="cell"
            style={{
              backgroundColor: (position % 2 === 0) ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 255, 0.1)'
            }}
          >
            {position}
            {players.map((player, index) => (
              player.position === position && (
                <div
                  key={player.id}
                  className="player"
                  style={{
                    backgroundColor: player.color,
                    boxShadow: `0 0 10px ${player.color}`
                  }}
                />
              )
            ))}
          </div>
        );
      }
      cells.push(
        <div key={row} className="board-row">
          {rowCells}
        </div>
      );
      number -= BOARD_SIZE;
    }
    return cells;
  };

  return (
    <div className="snake-and-ladder-game">
      {showTitle && (
        <div className="game-title" style={{
          position: 'absolute',
          zIndex: 1,
          fontSize: '2rem',
          color: '#00ff00',
          textShadow: '0 0 10px #00ff00',
          animation: 'glow 1.5s ease-in-out infinite alternate'
        }}>
          SNAKE & LADDER
        </div>
      )}
      <div className="game-info">
        <div className="player-turn">
          PLAYER {currentPlayer + 1}'S TURN
        </div>
        {message && <div className="message">{message}</div>}
        {diceValue && (
          <div className="dice" style={{ animation: isRolling ? 'shake 0.5s infinite' : 'none' }}>
            {diceValue}
          </div>
        )}
      </div>
      <div className="snake-and-ladder-board">
        {renderBoard()}
      </div>
      <div className="controls">
        <button 
          className="roll-button" 
          onClick={rollDice}
          disabled={isRolling || gameOver}
        >
          {isRolling ? 'ROLLING...' : 'ROLL DICE'}
        </button>
        <button className="reset-button" onClick={resetGame}>
          NEW GAME
        </button>
      </div>
    </div>
  );
};

export default SnakeAndLadder;
