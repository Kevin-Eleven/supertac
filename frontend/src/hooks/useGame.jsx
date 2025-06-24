import { createContext, useReducer, useContext, useEffect } from "react";

// const GameContext = createContext();
import { checkWinner, isBoardFull, simulateMove } from "../utils/gameLogic.js";
import { getBotMove } from "../utils/botAI.js";

function createInitialGameState() {
  return {
    boards: Array(9)
      .fill(null)
      .map(() => Array(9).fill(null)),
    boardWinners: Array(9).fill(null),
    activeBoard: null,
    currentPlayer: "x",
    isGameOver: false,
    gameWinner: null,
    isThinking: false,
    gameMode: "bot",
    botDifficulty: "medium",
  };
}

const gameReducer = (state, action) => {
  switch (action.type) {
    case "MAKE_MOVE": {
      const { boardIndex, cellIndex } = action.payload;

      // Validate move
      if (
        state.isGameOver ||
        state.boards[boardIndex][cellIndex] !== null ||
        state.boardWinners[boardIndex] !== null ||
        (state.activeBoard !== null && state.activeBoard !== boardIndex)
      ) {
        return state;
      }

      const newState = simulateMove(
        state,
        boardIndex,
        cellIndex,
        state.currentPlayer
      );

      return {
        ...newState,
        currentPlayer: state.currentPlayer === "x" ? "o" : "x",
      };
    }

    // the botMove payload is an object with boardIndex and cellIndex
    case "BOT_MOVE": {
      const { boardIndex, cellIndex } = action.payload;
      return gameReducer(state, {
        type: "MAKE_MOVE",
        payload: { boardIndex, cellIndex },
      });
    }

    case "RESET_GAME": {
      return {
        ...createInitialGameState(),
        gameMode: state.gameMode,
        botDifficulty: state.botDifficulty,
      };
    }
    case "SET_THINKING": {
      return { ...state, isThinking: action.payload };
    }

    case "SET_GAME_MODE": {
      return { ...state, gameMode: action.payload };
    }

    case "SET_BOT_DIFFICULTY": {
      return { ...state, botDifficulty: action.payload };
    }

    default:
      return state;
  }
};
// export const useGame = () => {
//   const context = useContext(GameContext);
//   if (!context) {
//     throw new Error("useGame must be used within a GameProvider");
//   }
//   return context;
// };

export const useGame = () => {
  const [gameState, dispatch] = useReducer(
    gameReducer,
    createInitialGameState()
  );

  // Handle bot moves

  // here the check for botMove happens automatically
  useEffect(() => {
    if (
      gameState.gameMode === "bot" &&
      gameState.currentPlayer === "o" &&
      !gameState.isGameOver &&
      !gameState.isThinking
    ) {
      dispatch({ type: "SET_THINKING", payload: true });
      // Simulate bot thinking time
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1500); // Simulate 1.5 seconds thinking time
      }).then(() => {
        const botMove = getBotMove(gameState, gameState.botDifficulty);
        if (botMove) {
          dispatch({ type: "BOT_MOVE", payload: botMove });
        }
        dispatch({ type: "SET_THINKING", payload: false });
      });
    }
  }, [
    gameState.currentPlayer,
    gameState.gameMode,
    gameState.isGameOver,
    gameState.isThinking,
  ]);

  const makeMove = (boardIndex, cellIndex) => {
    if (gameState.currentPlayer === "x") {
      dispatch({ type: "MAKE_MOVE", payload: { boardIndex, cellIndex } });
    } // Prevent making moves when it's not the player's turn
  };

  const resetGame = () => {
    dispatch({ type: "RESET_GAME" });
  };

  const setGameMode = (mode) => {
    dispatch({ type: "SET_GAME_MODE", payload: mode });
  };

  const setBotDifficulty = (difficulty) => {
    dispatch({ type: "SET_BOT_DIFFICULTY", payload: difficulty });
  };

  return {
    gameState,
    makeMove,
    resetGame,
    setGameMode,
    setBotDifficulty,
  };
};
