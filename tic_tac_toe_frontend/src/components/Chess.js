import React, { useState, useEffect } from 'react';

const INITIAL_BOARD = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

const Chess = () => {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState('');
  const [showTitle, setShowTitle] = useState(true);

  useEffect(() => {
    if (showTitle) {
      const timer = setTimeout(() => setShowTitle(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showTitle]);

  const isWhitePiece = (piece) => piece && piece === piece.toUpperCase();
  const isBlackPiece = (piece) => piece && piece === piece.toLowerCase();

  const getPieceSymbol = (piece) => {
    const symbols = {
      'k': '♔', 'q': '♕', 'r': '♖', 'b': '♗', 'n': '♘', 'p': '♙',
      'K': '♚', 'Q': '♛', 'R': '♜', 'B': '♝', 'N': '♞', 'P': '♟'
    };
    return symbols[piece] || '';
  };

  const isValidMove = (fromRow, fromCol, toRow, toCol) => {
    const piece = board[fromRow][fromCol];
    const targetPiece = board[toRow][toCol];

    // Can't capture own pieces
    if (targetPiece && 
        ((isWhitePiece(piece) && isWhitePiece(targetPiece)) || 
         (isBlackPiece(piece) && isBlackPiece(targetPiece)))) {
      return false;
    }

    const pieceType = piece.toLowerCase();
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    switch (pieceType) {
      case 'p': // Pawn
        const direction = isWhitePiece(piece) ? -1 : 1;
        const startRow = isWhitePiece(piece) ? 6 : 1;

        // Regular move
        if (colDiff === 0 && !targetPiece) {
          if (fromRow === startRow && toRow === fromRow + 2 * direction) {
            return !board[fromRow + direction][fromCol]; // Check if path is clear
          }
          return toRow === fromRow + direction;
        }
        // Capture
        if (colDiff === 1 && toRow === fromRow + direction && targetPiece) {
          return true;
        }
        return false;

      case 'r': // Rook
        return (fromRow === toRow || fromCol === toCol) && 
               isPathClear(fromRow, fromCol, toRow, toCol);

      case 'n': // Knight
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);

      case 'b': // Bishop
        return rowDiff === colDiff && isPathClear(fromRow, fromCol, toRow, toCol);

      case 'q': // Queen
        return ((fromRow === toRow || fromCol === toCol) || rowDiff === colDiff) && 
               isPathClear(fromRow, fromCol, toRow, toCol);

      case 'k': // King
        return rowDiff <= 1 && colDiff <= 1;

      default:
        return false;
    }
  };

  const isPathClear = (fromRow, fromCol, toRow, toCol) => {
    const rowStep = fromRow === toRow ? 0 : (toRow - fromRow) / Math.abs(toRow - fromRow);
    const colStep = fromCol === toCol ? 0 : (toCol - fromCol) / Math.abs(toCol - fromCol);

    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;

    while (currentRow !== toRow || currentCol !== toCol) {
      if (board[currentRow][currentCol]) return false;
      currentRow += rowStep;
      currentCol += colStep;
    }

    return true;
  };

  const isKingInCheck = (isWhiteKing) => {
    // Find king's position
    let kingRow, kingCol;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece === (isWhiteKing ? 'K' : 'k')) {
          kingRow = row;
          kingCol = col;
          break;
        }
      }
    }

    // Check if any opponent's piece can capture the king
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (!piece) continue;
        if (isWhiteKing === isWhitePiece(piece)) continue;
        if (isValidMove(row, col, kingRow, kingCol)) {
          return true;
        }
      }
    }
    return false;
  };

  const handleSquareClick = (row, col) => {
    const piece = board[row][col];

    if (!selectedPiece) {
      // Selecting a piece
      if (!piece || (isWhiteTurn !== isWhitePiece(piece))) return;
      setSelectedPiece({ row, col });
    } else {
      // Moving a piece
      const { row: fromRow, col: fromCol } = selectedPiece;
      if (isValidMove(fromRow, fromCol, row, col)) {
        const newBoard = board.map(row => [...row]);
        newBoard[row][col] = board[fromRow][fromCol];
        newBoard[fromRow][fromCol] = null;
        setBoard(newBoard);
        setIsWhiteTurn(!isWhiteTurn);
        
        // Check for check
        if (isKingInCheck(!isWhiteTurn)) {
          setGameStatus(`${!isWhiteTurn ? 'WHITE' : 'BLACK'} KING IN CHECK!`);
        } else {
          setGameStatus('');
        }
      }
      setSelectedPiece(null);
    }
  };

  const resetGame = () => {
    setBoard(INITIAL_BOARD);
    setSelectedPiece(null);
    setIsWhiteTurn(true);
    setGameStatus('');
    setShowTitle(true);
  };

  return (
    <div className="chess-game">
      {showTitle && (
        <div className="game-title" style={{
          position: 'absolute',
          zIndex: 1,
          fontSize: '2rem',
          color: '#00ff00',
          textShadow: '0 0 10px #00ff00',
          animation: 'glow 1.5s ease-in-out infinite alternate'
        }}>
          CHESS
        </div>
      )}
      <div className="game-status">
        {gameStatus || `${isWhiteTurn ? 'WHITE' : 'BLACK'}'S TURN`}
      </div>
      <div className="chess-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((piece, colIndex) => {
              const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
              const isLight = (rowIndex + colIndex) % 2 === 0;
              return (
                <button
                  key={colIndex}
                  className={`chess-square ${isLight ? 'light' : 'dark'} ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                >
                  {piece && (
                    <span className={isWhitePiece(piece) ? 'white-piece' : 'black-piece'}>
                      {getPieceSymbol(piece)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="controls">
        <button className="reset-button" onClick={resetGame}>
          NEW GAME
        </button>
      </div>
    </div>
  );
};

export default Chess;
