import React, { useState, useEffect, useRef } from 'react';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const BALL_SIZE = 15;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 10;
const INITIAL_BALL_SPEED = 5;
const SPEED_INCREMENT = 0.2;

const BouncingBall = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [highScore, setHighScore] = useState(0);
  
  // Game state refs for animation
  const ballRef = useRef({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    dx: INITIAL_BALL_SPEED,
    dy: -INITIAL_BALL_SPEED,
    speed: INITIAL_BALL_SPEED
  });
  
  const paddleRef = useRef({
    x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
    y: CANVAS_HEIGHT - 30
  });

  useEffect(() => {
    if (showTitle) {
      const timer = setTimeout(() => setShowTitle(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showTitle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let lastTime = 0;

    const render = (currentTime) => {
      if (gameOver || isPaused) return;

      const deltaTime = currentTime - lastTime;
      if (deltaTime < 16) { // Cap at ~60 FPS
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      lastTime = currentTime;

      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw scanlines
      ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
      for (let i = 0; i < canvas.height; i += 4) {
        ctx.fillRect(0, i, canvas.width, 2);
      }

      // Draw score
      ctx.font = '20px "Press Start 2P"';
      ctx.fillStyle = '#00ff00';
      ctx.textAlign = 'left';
      ctx.fillText(`SCORE: ${score}`, 20, 30);
      ctx.textAlign = 'right';
      ctx.fillText(`HIGH: ${highScore}`, CANVAS_WIDTH - 20, 30);

      // Draw ball
      ctx.beginPath();
      ctx.arc(ballRef.current.x, ballRef.current.y, BALL_SIZE, 0, Math.PI * 2);
      ctx.fillStyle = '#00ff00';
      ctx.fill();
      ctx.closePath();

      // Draw paddle
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(
        paddleRef.current.x,
        paddleRef.current.y,
        PADDLE_WIDTH,
        PADDLE_HEIGHT
      );

      // Ball collision with walls
      if (ballRef.current.x + BALL_SIZE > canvas.width || ballRef.current.x - BALL_SIZE < 0) {
        ballRef.current.dx = -ballRef.current.dx;
      }
      if (ballRef.current.y - BALL_SIZE < 0) {
        ballRef.current.dy = -ballRef.current.dy;
      }

      // Ball collision with paddle
      if (
        ballRef.current.y + BALL_SIZE > paddleRef.current.y &&
        ballRef.current.x > paddleRef.current.x &&
        ballRef.current.x < paddleRef.current.x + PADDLE_WIDTH
      ) {
        ballRef.current.dy = -ballRef.current.dy;
        ballRef.current.speed += SPEED_INCREMENT;
        setScore(prev => prev + 1);
        setHighScore(prev => Math.max(prev, score + 1));
      }

      // Ball out of bounds
      if (ballRef.current.y + BALL_SIZE > canvas.height) {
        setGameOver(true);
        return;
      }

      // Update ball position
      ballRef.current.x += ballRef.current.dx * (ballRef.current.speed / INITIAL_BALL_SPEED);
      ballRef.current.y += ballRef.current.dy * (ballRef.current.speed / INITIAL_BALL_SPEED);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameOver, isPaused, score]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (gameOver || isPaused) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleRef.current.x = Math.min(
          Math.max(relativeX - PADDLE_WIDTH / 2, 0),
          canvas.width - PADDLE_WIDTH
        );
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [gameOver, isPaused]);

  const resetGame = () => {
    ballRef.current = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      dx: INITIAL_BALL_SPEED,
      dy: -INITIAL_BALL_SPEED,
      speed: INITIAL_BALL_SPEED
    };
    paddleRef.current = {
      x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
      y: CANVAS_HEIGHT - 30
    };
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setShowTitle(true);
  };

  return (
    <div className="bouncing-ball-game">
      {showTitle && (
        <div className="game-title" style={{
          position: 'absolute',
          zIndex: 1,
          fontSize: '2rem',
          color: '#00ff00',
          textShadow: '0 0 10px #00ff00',
          animation: 'glow 1.5s ease-in-out infinite alternate'
        }}>
          BOUNCING BALL
        </div>
      )}
      <div className="game-status">
        {gameOver && <span className="game-over">GAME OVER!</span>}
        {isPaused && <span className="paused">PAUSED</span>}
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{
          border: '4px solid #00ff00',
          boxShadow: '0 0 10px #00ff00',
          backgroundColor: '#000000'
        }}
      />
      <div className="controls">
        <button className="reset-button" onClick={resetGame}>
          {gameOver ? 'PLAY AGAIN' : 'RESET'}
        </button>
        {!gameOver && (
          <button 
            className="pause-button" 
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? 'RESUME' : 'PAUSE'}
          </button>
        )}
      </div>
      <div className="instructions">
        <p>MOVE MOUSE TO CONTROL PADDLE</p>
        <p>DON'T LET THE BALL DROP!</p>
      </div>
    </div>
  );
};

export default BouncingBall;
