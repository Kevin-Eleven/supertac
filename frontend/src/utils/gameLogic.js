// Check if a board has a winner
export const checkWinner = (board) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

// Check if board is full
export const isBoardFull = (board) => {
  return board.every((cell) => cell !== null);
};

// Get available moves for a board
export const getAvailableMoves = (board) => {
  return board
    .map((cell, index) => (cell === null ? index : null))
    .filter((index) => index !== null);
};

// Get all available moves across all boards
export const getAllAvailableMoves = (gameState) => {
  const moves = [];
  const { boards, boardWinners, activeBoard } = gameState;

  const boardsToCheck =
    activeBoard !== null
      ? [activeBoard] // square brackets mean an array
      : boardWinners
          .map((winner, i) => (winner === null ? i : null))
          .filter((i) => i !== null);

  boardsToCheck.forEach((boardIndex) => {
    if (boardWinners[boardIndex] === null) {
      getAvailableMoves(boards[boardIndex]).forEach((cellIndex) => {
        moves.push({ boardIndex, cellIndex });
      });
    }
  });

  return moves;
};

// Simulate a move and return new game state
// wow simulateMove just does the move and that's it
export const simulateMove = (gameState, boardIndex, cellIndex, player) => {
  // what do i want my simulateMove function to do?
  // update the board
  // check if board has a winner
  // check if game has a winner
  // i dont need to check if the move is valid here

  const newBoards = gameState.boards.map((board, i) =>
    i === boardIndex
      ? board.map((cellValue, j) => (j === cellIndex ? player : cellValue))
      : board
  );

  const newBoardWinners = [...gameState.boardWinners];
  const boardWinner = checkWinner(newBoards[boardIndex]);
  if (boardWinner) {
    newBoardWinners[boardIndex] = boardWinner;
  } else if (isBoardFull(newBoards[boardIndex])) {
    newBoardWinners[boardIndex] = "draw";
  }

  let nextActiveBoard = cellIndex;
  if (
    newBoardWinners[cellIndex] !== null ||
    isBoardFull(newBoards[cellIndex])
  ) {
    nextActiveBoard = null;
  }

  // putting the array of board winners into a new array and checking the game winner
  const gameWinner = checkWinner(
    newBoardWinners.map((w) => (w === "draw" ? null : w))
  );

  const isGameOver =
    gameWinner !== null || newBoardWinners.every((w) => w !== null);

  const isDraw = !gameWinner && newBoardWinners.every((w) => w !== null);

  return {
    ...gameState,
    boards: newBoards,
    boardWinners: newBoardWinners,
    activeBoard: nextActiveBoard,
    gameWinner,
    isGameOver,
    isDraw,
  };
};
