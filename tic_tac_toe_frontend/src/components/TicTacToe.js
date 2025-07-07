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
  };

  const handleModeSelect = (mode) => {
    setGameMode(mode);
    handleReset();
  };

  const getStatus = () => {
    if (winner) {
      return `Winner: ${winner}`;
    } else if (isBoardFull(squares)) {
      return "Game Draw!";
    } else {
      return `Next player: ${xIsNext ? 'X' : 'O'}`;
    }
  };

  return (
    <div className="game">
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
