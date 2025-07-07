import React, { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = 'RIGHT';
const GAME_SPEED = 150;

// PUBLIC_INTERFACE
const Snake = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showTitle, setShowTitle] = useState(true);

  useEffect(() => {
    if (showTitle) {
      const timer = setTimeout(() => setShowTitle(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showTitle]);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    setShowTitle(true);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(currentSnake => {
      const head = currentSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
        default: break;
      }

      if (newHead.x < 0 || newHead.x >= GRID_SIZE || 
          newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true);
        return currentSnake;
      }

      if (currentSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return currentSnake;
      }

      const newSnake = [newHead, ...currentSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setFood(generateFood());
        setScore(s => s + 1);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  return (
    <div className="snake-game">
      {showTitle && (
        <div className="game-title" style={{
          position: 'absolute',
          zIndex: 1,
          fontSize: '2rem',
          color: '#00ff00',
          textShadow: '0 0 10px #00ff00',
          animation: 'glow 1.5s ease-in-out infinite alternate'
        }}>
          SNAKE
        </div>
      )}
      <div className="game-status">
        <span>SCORE: {score.toString().padStart(5, '0')}</span>
        {gameOver && <span className="game-over">GAME OVER!</span>}
        {isPaused && <span className="paused">PAUSED</span>}
      </div>
      <div 
        className="snake-board"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            className="snake-segment"
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE - 1,
              height: CELL_SIZE - 1,
            }}
          />
        ))}
        <div
          className="food"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE - 1,
            height: CELL_SIZE - 1,
          }}
        />
      </div>
      <div className="controls">
        <button className="reset-button" onClick={resetGame}>
          {gameOver ? 'PLAY AGAIN' : 'RESET GAME'}
        </button>
        {!gameOver && (
          <button className="pause-button" onClick={() => setIsPaused(p => !p)}>
            {isPaused ? 'RESUME' : 'PAUSE'}
          </button>
        )}
      </div>
      <div className="instructions">
        <p>← → ↑ ↓ TO MOVE</p>
        <p>SPACE TO PAUSE</p>
      </div>
    </div>
  );
};

export default Snake;
