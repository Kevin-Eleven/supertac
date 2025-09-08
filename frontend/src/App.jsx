import React, { useEffect, useState } from "react";

import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import GameBoard from "./components/GameBoard";
import DifficultySelector from "./components/DifficultySelector";
import RoomsView from "./components/RoomsView";
import WaitingScreen from "./components/WaitingScreen";

import { useGame } from "./hooks/useGame";
import MultiplayerLobby from "./components/MultiplayerLobby";

const VIEW_STORAGE_KEY = "supertac_current_view";
const DIFFICULTY_STORAGE_KEY = "supertac_selected_difficulty";

// Load view state from localStorage
function loadViewFromStorage(gameState) {
  try {
    const savedView = localStorage.getItem(VIEW_STORAGE_KEY);
    const savedDifficulty = localStorage.getItem(DIFFICULTY_STORAGE_KEY);

    // Only restore view if we have a saved offline game
    if (
      savedView &&
      (gameState.gameMode === "bot" || gameState.gameMode === "local")
    ) {
      return {
        view: savedView,
        difficulty: savedDifficulty || "medium",
      };
    }
  } catch (error) {
    console.error("Error loading view state from localStorage:", error);
  }
  return {
    view: "home",
    difficulty: "medium",
  };
}

// Save view state to localStorage
function saveViewToStorage(view, difficulty, gameMode) {
  try {
    // Only save for offline games
    if (gameMode === "bot" || gameMode === "local") {
      localStorage.setItem(VIEW_STORAGE_KEY, view);
      localStorage.setItem(DIFFICULTY_STORAGE_KEY, difficulty);
    }
  } catch (error) {
    console.error("Error saving view state to localStorage:", error);
  }
}

// Clear view state from localStorage
function clearViewFromStorage() {
  try {
    localStorage.removeItem(VIEW_STORAGE_KEY);
    localStorage.removeItem(DIFFICULTY_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing view state from localStorage:", error);
  }
}

function App() {
  const {
    gameState,
    makeMove,
    resetGame,
    setGameMode,
    setBotDifficulty,
    createRoom,
    playRandom,
    joinRoomById,
  } = useGame();

  // Initialize view state based on saved data
  const [currentView, setCurrentView] = useState(() => {
    return loadViewFromStorage(gameState).view;
  });

  const [selectedDifficulty, setSelectedDifficulty] = useState(() => {
    return loadViewFromStorage(gameState).difficulty;
  });

  const [joiningRoom, setJoiningRoom] = useState(false);

  // Save view state whenever it changes (for offline games only)
  useEffect(() => {
    if (gameState.gameMode === "bot" || gameState.gameMode === "local") {
      saveViewToStorage(currentView, selectedDifficulty, gameState.gameMode);
    }
  }, [currentView, selectedDifficulty, gameState.gameMode]);

  // Clear view storage when switching to online mode
  useEffect(() => {
    if (gameState.gameMode === "online") {
      clearViewFromStorage();
    }
  }, [gameState.gameMode]);

  const handlePlayBot = () => {
    setCurrentView("difficulty");
  };

  const handlePlayMultiplayer = () => {
    // TODO: Implement multiplayer lobby
    setCurrentView("multiplayer");
  };

  const handleDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const handleStartBotGame = () => {
    setGameMode("bot");
    setBotDifficulty(selectedDifficulty);
    resetGame();
    setCurrentView("game");
  };

  const handleBackToHome = () => {
    resetGame();
    setCurrentView("home");
    clearViewFromStorage(); // Clear view storage when going home
    // when i go home i want to disconnect from the socket connection
  };

  const handleBackToDifficulty = () => {
    setCurrentView("difficulty");
  };

  const handleResetGame = () => {
    resetGame();
  };

  const handlePlayRandom = () => {
    setGameMode("online");
    // resetGame();
    // join a random room and start playing if no room available
    // play with bot
    playRandom();
    setCurrentView("game");
  };

  const handleCreateRoom = (roomName) => {
    // resetGame();
    createRoom(roomName);
    setCurrentView("game");
  };

  const handleJoinRoom = (roomId) => {
    // resetGame();
    setJoiningRoom(true);
    joinRoomById(roomId);
    setCurrentView("game");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header onHomeClick={handleBackToHome} />
      {currentView === "home" ? (
        <HomePage
          onPlayBot={handlePlayBot}
          onPlayMultiplayer={handlePlayMultiplayer}
        />
      ) : currentView === "difficulty" ? (
        <DifficultySelector
          selectedDifficulty={selectedDifficulty}
          onSelect={handleDifficultySelect}
          onStart={handleStartBotGame}
          onBack={handleBackToHome}
        />
      ) : currentView === "game" ? (
        gameState.waitingForPlayer ? (
          <WaitingScreen roomId={gameState.roomId} />
        ) : (
          <GameBoard
            gameState={gameState}
            onCellClick={makeMove}
            onResetGame={handleResetGame}
            onBackToHome={handleBackToHome}
          />
        )
      ) : currentView === "multiplayer" ? (
        <RoomsView
          onPlayRandom={handlePlayRandom}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          joiningRoom={joiningRoom}
          onBack={handleBackToHome}
        />
      ) : currentView === "lobby" ? (
        <MultiplayerLobby gameState={gameState} />
      ) : (
        <HomePage
          onPlayBot={handlePlayBot}
          onPlayMultiplayer={handlePlayMultiplayer}
        />
      )}
    </div>
  );
}

export default App;
