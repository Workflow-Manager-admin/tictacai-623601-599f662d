// PUBLIC_INTERFACE
export const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

// PUBLIC_INTERFACE
export const isBoardFull = (squares) => {
  return squares.every(square => square !== null);
};

// PUBLIC_INTERFACE
export const getAIMove = (squares) => {
  // Basic AI: Look for first empty square
  const emptySquares = squares
    .map((square, index) => ({ square, index }))
    .filter(({ square }) => square === null);
  
  if (emptySquares.length === 0) return null;
  
  // Random move selection for basic AI
  const randomIndex = Math.floor(Math.random() * emptySquares.length);
  return emptySquares[randomIndex].index;
};
