import React, { useState } from 'react';
import './App.css';
import TicTacToe from './components/TicTacToe';
import Snake from './components/Snake';

// PUBLIC_INTERFACE
function App() {
  const [currentGame, setCurrentGame] = useState('tictactoe');

  return (
    <div className="App">
      <div className="game">
        <h1>Game Center</h1>
        <div className="game-selector">
          <button 
            className={currentGame === 'tictactoe' ? 'active' : ''} 
            onClick={() => setCurrentGame('tictactoe')}
          >
            Tic Tac Toe
          </button>
          <button 
            className={currentGame === 'snake' ? 'active' : ''} 
            onClick={() => setCurrentGame('snake')}
          >
            Snake
          </button>
        </div>
        {currentGame === 'tictactoe' ? <TicTacToe /> : <Snake />}
      </div>
    </div>
  );
}

export default App;
