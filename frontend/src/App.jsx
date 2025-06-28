import React, { useState } from "react";

import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import GameBoard from "./components/GameBoard";
import DifficultySelector from "./components/DifficultySelector";
import RoomsView from "./components/RoomsView";
import WaitingScreen from "./components/WaitingScreen";

import { useGame } from "./hooks/useGame";
import MultiplayerLobby from "./components/MultiplayerLobby";
function App() {
  const [currentView, setCurrentView] = useState("home"); // 'home', 'difficulty', 'game', 'multiplayer'
  const [joiningRoom, setJoiningRoom] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");

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
