import { useReducer, useEffect } from "react";
import { simulateMove } from "../utils/gameLogic.js";
import { getBotMove } from "../utils/botAI.js";
import socketService from "../services/socketService";

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
    gameMode: "bot", // "bot", "local", or "online"
    botDifficulty: "medium",
    roomId: null,
    roomName: null,
    playerSymbol: null,
    isMyTurn: false,
    playerName: null,
    opponentName: null,
    waitingForPlayer: false,
    rooms: [],
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

    case "SET_ROOM": {
      return { ...state, roomId: action.payload };
    }

    case "SET_PLAYER_INFO": {
      return {
        ...state,
        playerSymbol: action.payload.symbol,
        isMyTurn: action.payload.symbol === "x",
      };
    }

    case "SET_OPPONENT_INFO": {
      return { ...state, opponentName: action.payload };
    }

    case "SET_WAITING": {
      return { ...state, waitingForPlayer: action.payload };
    }

    case "UPDATE_TURN": {
      return { ...state, isMyTurn: action.payload };
    }

    // Update the OPPONENT_LEFT case in the gameReducer function
    case "OPPONENT_LEFT": {
      return {
        ...state,
        isGameOver: true,
        gameWinner: "opponent_left",
        roomId: null,
        waitingForPlayer: false,
      };
    }

    case "UPDATE_GAME_STATE": {
      const {
        boards,
        boardWinners,
        activeBoard,
        isGameOver,
        gameWinner,
        roomId,
      } = action.payload;
      return {
        ...state,
        boards,
        boardWinners,
        activeBoard,
        isGameOver,
        gameWinner,
        roomId,
      };
    }

    default:
      return state;
  }
};

export const useGame = () => {
  const [gameState, dispatch] = useReducer(
    gameReducer,
    createInitialGameState()
  );

  // Handle bot moves
  useEffect(() => {
    const handleBotMove = () => {
      if (
        gameState.gameMode === "bot" &&
        gameState.currentPlayer === "o" &&
        !gameState.isGameOver &&
        !gameState.isThinking
      ) {
        dispatch({ type: "SET_THINKING", payload: true });
        setTimeout(() => {
          const botMove = getBotMove(gameState, gameState.botDifficulty);
          if (botMove) {
            dispatch({ type: "BOT_MOVE", payload: botMove });
          }
          dispatch({ type: "SET_THINKING", payload: false });
        }, 400);
      }
    };

    handleBotMove();
  }, [gameState]);

  // Socket connection and event handlers
  useEffect(() => {
    if (gameState.gameMode === "online") {
      const socket = socketService.connect();

      socket.on("gameStart", ({ gameState: serverGameState, players }) => {
        const player = players.find((p) => p.id === socket.id);
        const opponent = players.find((p) => p.id !== socket.id);

        dispatch({
          type: "UPDATE_GAME_STATE",
          payload: serverGameState,
        });

        dispatch({
          type: "SET_PLAYER_INFO",
          payload: {
            symbol: player.symbol,
          },
        });

        dispatch({ type: "SET_OPPONENT_INFO", payload: opponent.id });
        dispatch({ type: "SET_WAITING", payload: false });
      });

      socket.on("waitingForPlayer", ({ roomId }) => {
        dispatch({ type: "SET_ROOM", payload: roomId });
        dispatch({ type: "SET_WAITING", payload: true });
      });

      socket.on("moveConfirmed", ({ boardIndex, cellIndex, symbol }) => {
        console.log(`Move confirmed: ${boardIndex},${cellIndex} by ${symbol}`);
      });

      socket.on("moveMade", ({ gameState: updatedGameState }) => {
        dispatch({
          type: "UPDATE_GAME_STATE",
          payload: updatedGameState,
        });
      });

      socket.on("turnChange", ({ currentTurn }) => {
        dispatch({
          type: "UPDATE_TURN",
          payload: currentTurn === socket.id,
        });
      });

      socket.on("moveError", ({ message }) => {
        console.error("Move error:", message);
      });

      socket.on("playerLeft", () => {
        dispatch({ type: "OPPONENT_LEFT" });
      });

      socket.on("roomError", ({ message }) => {
        console.error("Room error:", message);
        // If no rooms available, switch to bot mode
        if (message === "No available rooms") {
          dispatch({ type: "SET_GAME_MODE", payload: "bot" });
        }
      });

      return () => {
        socketService.disconnect();
      };
    }
  }, [gameState.gameMode]);

  const makeMove = (boardIndex, cellIndex) => {
    // For online mode, only send move to server and wait for server response
    if (gameState.gameMode === "online") {
      if (!gameState.isMyTurn || gameState.isGameOver) return;
      // roomId is coming out to be null
      // how to fix this?
      console.log(
        `roomId: ${gameState.roomId}, boardIndex: ${boardIndex}, cellIndex: ${cellIndex}`
      );

      socketService.makeMove(gameState.roomId, boardIndex, cellIndex);
      return;
    }
    // For local/bot mode, update state directly
    dispatch({ type: "MAKE_MOVE", payload: { boardIndex, cellIndex } });
  };

  // when i play i want to join a random available room
  // if no room available i want to play with bot

  const playRandom = () => {
    setGameMode("online");
    socketService.joinRoom();
  };

  const joinRoomById = (roomId) => {
    setGameMode("online");
    socketService.joinRoomById(roomId);
    socketService.joinRoomById(roomId, () => {
      dispatch({ type: "SET_WAITING", payload: true });
    });
  };
  // when i create a room i want the id generated by the server
  // and then i want to set the roomId in the gameState
  // In useGame.jsx
  const createRoom = (roomName) => {
    setGameMode("online");
    socketService.createRoom(roomName, (roomId) => {
      dispatch({ type: "SET_ROOM", payload: roomId });
      dispatch({ type: "SET_WAITING", payload: true });
    });
  };

  const resetGame = () => {
    // Prevent resetting when in online multiplayer
    // show a modal that if the user wants to quit the game
    // and reset the game
    socketService.disconnect();

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
    playRandom,
    createRoom,
    joinRoomById,
  };
};
