import React, { useState, useEffect } from 'react';
import Board from './Board';
import GameControls from './GameControls';
import { calculateWinner, isBoardFull, getAIMove } from '../utils/gameLogic';

// PUBLIC_INTERFACE
const TicTacToe = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameMode, setGameMode] = useState('pvp');
  const [winner, setWinner] = useState(null);
  const [showTitle, setShowTitle] = useState(true);

  useEffect(() => {
    if (showTitle) {
      const timer = setTimeout(() => setShowTitle(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showTitle]);

  useEffect(() => {
    if (!xIsNext && gameMode === 'ai' && !winner) {
      const aiMove = getAIMove(squares);
      if (aiMove !== null) {
        setTimeout(() => handleClick(aiMove), 500);
      }
    }
  }, [xIsNext, gameMode, squares, winner]);

  const handleClick = (i) => {
    if (winner || squares[i]) return;

    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? 'X' : 'O';
    
    const gameWinner = calculateWinner(newSquares);
    if (gameWinner) {
      setWinner(gameWinner);
    }
    
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  };

  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setShowTitle(true);
  };

  const handleModeSelect = (mode) => {
    setGameMode(mode);
    handleReset();
  };

  const getStatus = () => {
    if (winner) {
      return `WINNER: ${winner}`;
    } else if (isBoardFull(squares)) {
      return "DRAW!";
    } else {
      return `NEXT: ${xIsNext ? 'X' : 'O'}`;
    }
  };

  return (
    <div className="game">
      {showTitle && (
        <div className="game-title" style={{
          position: 'absolute',
          zIndex: 1,
          fontSize: '2rem',
          color: '#00ff00',
          textShadow: '0 0 10px #00ff00',
          animation: 'glow 1.5s ease-in-out infinite alternate'
        }}>
          TIC TAC TOE
        </div>
      )}
      <div className="game-status">{getStatus()}</div>
      <Board squares={squares} onClick={handleClick} />
      <GameControls 
        onModeSelect={handleModeSelect}
        onReset={handleReset}
        currentMode={gameMode}
      />
    </div>
  );
};

export default TicTacToe;
