const PLAYER_X = "x";
const PLAYER_O = "o";

import { getAllAvailableMoves, simulateMove } from "./gameLogic.js";

// Easy AI - Random moves
const getEasyMove = (gameState) => {
  const availableMoves = getAllAvailableMoves(gameState);
  if (availableMoves.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  console.log(
    `Easy AI selected move: ${availableMoves[randomIndex].boardIndex}, ${availableMoves[randomIndex].cellIndex}`
  );
  // Log the selected move for debugging
  return availableMoves[randomIndex];
};

// Medium AI - Basic strategy with occasional mistakes
const getMediumMove = (gameState) => {
  const availableMoves = getAllAvailableMoves(gameState);
  if (availableMoves.length === 0) return null;

  // 30% chance to make a random move (simulate mistakes)
  if (Math.random() < 0.3) {
    return getEasyMove(gameState);
  }

  // Try to win first
  for (const move of availableMoves) {
    const simulated = simulateMove(
      gameState,
      move.boardIndex,
      move.cellIndex,
      PLAYER_O
    );
    if (simulated.gameWinner === PLAYER_O) {
      return move;
    }
  }

  // Try to block opponent from winning
  for (const move of availableMoves) {
    const simulated = simulateMove(
      gameState,
      move.boardIndex,
      move.cellIndex,
      PLAYER_X
    );
    if (simulated.gameWinner === PLAYER_X) {
      return move;
    }
  }

  // Try to win a board
  for (const move of availableMoves) {
    const simulated = simulateMove(
      gameState,
      move.boardIndex,
      move.cellIndex,
      PLAYER_O
    );
    if (simulated.boardWinners[move.boardIndex] === PLAYER_O) {
      return move;
    }
  }

  // Try to block opponent from winning a board
  for (const move of availableMoves) {
    const simulated = simulateMove(
      gameState,
      move.boardIndex,
      move.cellIndex,
      PLAYER_X
    );
    if (simulated.boardWinners[move.boardIndex] === PLAYER_X) {
      return move;
    }
  }

  // Take center if available
  const centerMoves = availableMoves.filter((move) => move.cellIndex === 4);
  if (centerMoves.length > 0) {
    return centerMoves[Math.floor(Math.random() * centerMoves.length)];
  }

  // Random move
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

// Hard AI - Minimax algorithm
const getHardMove = (gameState) => {
  const availableMoves = getAllAvailableMoves(gameState);
  if (availableMoves.length === 0) return null;

  let bestScore = -Infinity;
  let bestMove = null;

  for (const move of availableMoves) {
    const simulated = simulateMove(
      gameState,
      move.boardIndex,
      move.cellIndex,
      PLAYER_O
    );
    const score = minimax(simulated, 6, false, -Infinity, Infinity);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove || availableMoves[0];
};

// Minimax algorithm with alpha-beta pruning
const minimax = (gameState, depth, isMaximizing, alpha, beta) => {
  if (gameState.isGameOver || depth === 0) {
    return evaluatePosition(gameState);
  }

  const availableMoves = getAllAvailableMoves(gameState);

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const move of availableMoves) {
      const simulated = simulateMove(
        gameState,
        move.boardIndex,
        move.cellIndex,
        PLAYER_O
      );
      const score = minimax(simulated, depth - 1, false, alpha, beta);
      maxScore = Math.max(score, maxScore);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const move of availableMoves) {
      const simulated = simulateMove(
        gameState,
        move.boardIndex,
        move.cellIndex,
        PLAYER_X
      );
      const score = minimax(simulated, depth - 1, true, alpha, beta);
      minScore = Math.min(score, minScore);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return minScore;
  }
};

// Evaluate the current position
const evaluatePosition = (gameState) => {
  if (gameState.gameWinner === PLAYER_O) return 1000;
  if (gameState.gameWinner === PLAYER_X) return -1000;
  if (gameState.isDraw) return 0;

  let score = 0;

  // Evaluate board control
  gameState.boardWinners.forEach((winner) => {
    if (winner === PLAYER_O) score += 100;
    else if (winner === PLAYER_X) score -= 100;
  });

  // Evaluate potential wins
  gameState.boards.forEach((board, boardIndex) => {
    if (gameState.boardWinners[boardIndex] === null) {
      score += evaluateBoard(board, PLAYER_O) - evaluateBoard(board, PLAYER_X);
    }
  });

  return score;
};

// Evaluate a single board
const evaluateBoard = (board, player) => {
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

  let score = 0;
  lines.forEach((line) => {
    const [a, b, c] = line;
    const values = [board[a], board[b], board[c]];
    const playerCount = values.filter((v) => v === player).length;
    const emptyCount = values.filter((v) => v === null).length;
    const opponentCount = values.filter(
      (v) => v !== null && v !== player
    ).length;

    if (opponentCount === 0) {
      if (playerCount === 2 && emptyCount === 1) score += 10;
      else if (playerCount === 1 && emptyCount === 2) score += 1;
    }
  });

  return score;
};

// Main function to get bot move
export const getBotMove = (gameState, difficulty) => {
  switch (difficulty) {
    case "easy":
      return getEasyMove(gameState);
    case "medium":
      return getMediumMove(gameState);
    case "hard":
      return getHardMove(gameState);
    default:
      return getMediumMove(gameState);
  }
};
