import React, { useState } from 'react';
import './App.css';
import TicTacToe from './components/TicTacToe';
import Snake from './components/Snake';
import SnakeAndLadder from './components/SnakeAndLadder';
import Chess from './components/Chess';

// PUBLIC_INTERFACE
function App() {
  const [currentGame, setCurrentGame] = useState('tictactoe');

  const renderGame = () => {
    switch (currentGame) {
      case 'tictactoe':
        return <TicTacToe />;
      case 'snake':
        return <Snake />;
      case 'snakeandladder':
        return <SnakeAndLadder />;
      case 'chess':
        return <Chess />;
      default:
        return <TicTacToe />;
    }
  };

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
          <button 
            className={currentGame === 'snakeandladder' ? 'active' : ''} 
            onClick={() => setCurrentGame('snakeandladder')}
          >
            SNAKE & LADDER
          </button>
          <button 
            className={currentGame === 'chess' ? 'active' : ''} 
            onClick={() => setCurrentGame('chess')}
          >
            CHESS
          </button>
        </div>
        {renderGame()}
      </div>
    </div>
  );
}

export default App;
