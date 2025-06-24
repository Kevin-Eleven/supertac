import React, { useState } from "react";

import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import GameBoard from "./components/GameBoard";
import DifficultySelector from "./components/DifficultySelector";

import { useGame } from "./hooks/useGame";
function App() {
  const [currentView, setCurrentView] = useState("home"); // 'home', 'difficulty', 'game', 'multiplayer'
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");

  const { gameState, makeMove, resetGame, setGameMode, setBotDifficulty } =
    useGame();

  const handlePlayBot = () => {
    setCurrentView("difficulty");
  };

  const handlePlayMultiplayer = () => {
    // TODO: Implement multiplayer lobby
    alert(
      "Multiplayer mode coming soon! For now, enjoy playing against our AI bots."
    );
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
    setCurrentView("home");
    resetGame();
  };

  const handleBackToDifficulty = () => {
    setCurrentView("difficulty");
  };

  const handleResetGame = () => {
    resetGame();
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
        <GameBoard
          gameState={gameState}
          onCellClick={makeMove}
          onResetGame={handleResetGame}
          onBackToHome={handleBackToHome}
        />
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
