const X = "x";
const O = "o";

import { getAllAvailableMoves, simulateMove } from "./gameLogic.js";

// Easy AI - Random moves
const getEasyMove = (gameState) => {
  const availableMoves = getAllAvailableMoves(gameState);
  if (availableMoves.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIndex];
};

// Medium AI - Minimax with lesser depth
const getMediumMove = (gameState) => {
  const availableMoves = getAllAvailableMoves(gameState);
  if (availableMoves.length === 0) return null;

  let bestScore = -Infinity;
  let bestMove = null;

  for (const move of availableMoves) {
    const simulated = simulateMove(
      gameState,
      move.boardIndex,
      move.cellIndex,
      O
    );
    const score = minimax(simulated, 4, false, -Infinity, Infinity);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove || availableMoves[0];
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
      O
    );
    const score = minimax(simulated, 5, false, -Infinity, Infinity);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove || availableMoves[0];
};

// Minimax algorithm with alpha-beta pruning
// O is maximising and X is Minimising

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
        O
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
        X
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
  if (gameState.gameWinner === O) return 1000;
  if (gameState.gameWinner === X) return -1000;
  if (gameState.isDraw) return 0;

  let score = 0;

  // Evaluate board control
  gameState.boardWinners.forEach((winner) => {
    if (winner === O) score += 100;
    else if (winner === X) score -= 100;
  });

  // Evaluate potential wins
  gameState.boards.forEach((board, boardIndex) => {
    if (gameState.boardWinners[boardIndex] === null) {
      score += evaluateBoard(board, O) - evaluateBoard(board, X);
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
