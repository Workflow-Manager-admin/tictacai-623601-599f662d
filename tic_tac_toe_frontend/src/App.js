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
        <h1>RETRO ARCADE</h1>
        <div className="game-selector">
          <button 
            className={currentGame === 'tictactoe' ? 'active' : ''} 
            onClick={() => setCurrentGame('tictactoe')}
          >
            TIC TAC TOE
          </button>
          <button 
            className={currentGame === 'snake' ? 'active' : ''} 
            onClick={() => setCurrentGame('snake')}
          >
            SNAKE
          </button>
        </div>
        {currentGame === 'tictactoe' ? <TicTacToe /> : <Snake />}
      </div>
    </div>
  );
}

export default App;
