import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, RotateCcw, Bot, User } from "lucide-react";
import MiniBoard from "./MiniBoard";

const GameBoard = ({ gameState, onCellClick, onResetGame, onBackToHome }) => {
  const getDifficultyInfo = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return {
          name: "Easy",
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-100 dark:bg-green-900/30",
        };
      case "medium":
        return {
          name: "Medium",
          color: "text-orange-600 dark:text-orange-400",
          bgColor: "bg-orange-100 dark:bg-orange-900/30",
        };
      case "hard":
        return {
          name: "Hard",
          color: "text-red-600 dark:text-red-400",
          bgColor: "bg-red-100 dark:bg-red-900/30",
        };
      default:
        return {
          name: "Medium",
          color: "text-orange-600 dark:text-orange-400",
          bgColor: "bg-orange-100 dark:bg-orange-900/30",
        };
    }
  };

  const difficultyInfo = getDifficultyInfo(gameState.botDifficulty);

  const getStatusMessage = () => {
    if (gameState.isGameOver) {
      if (gameState.gameWinner === "opponent_left") {
        return "Opponent Left the Game";
      }
      if (gameState.gameWinner) {
        if (gameState.gameMode === "bot") {
          return `${gameState.gameWinner === "x" ? "You" : "Bot"} Won!`;
        } else {
          return gameState.isMyTurn
            ? gameState.gameWinner === gameState.playerSymbol
              ? "You Won!"
              : "Opponent Won!"
            : gameState.gameWinner === gameState.playerSymbol
            ? "You Won!"
            : "Opponent Won!";
        }
      }
      return "It's a Draw!";
    }

    if (gameState.isThinking) {
      return "Bot is thinking...";
    }

    if (gameState.gameMode === "online") {
      return gameState.isMyTurn ? "Your Turn" : "Opponent's Turn";
    }

    return gameState.gameMode === "bot"
      ? `${gameState.currentPlayer === "x" ? "Your" : "Bot's"} Turn`
      : `Player ${gameState.currentPlayer}'s Turn`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Game Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              {gameState.gameMode !== "online" && (
                <button
                  onClick={onBackToHome}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                >
                  <Home className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Super Tic Tac Toe
                </h1>
                <div className="flex items-center space-x-2">
                  {gameState.gameMode === "bot" && (
                    <div
                      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${difficultyInfo.bgColor} ${difficultyInfo.color}`}
                    >
                      <Bot className="w-3 h-3" />
                      <span>{difficultyInfo.name} Bot</span>
                    </div>
                  )}
                  {gameState.gameMode === "online" && (
                    <div className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      <User className="w-3 h-3" />
                      <span>
                        You are {gameState.playerSymbol?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {getStatusMessage()}
                </div>
                {gameState.isThinking && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mt-1"
                  />
                )}
              </div>
              <button
                onClick={onResetGame}
                disabled={gameState.gameMode === "online"}
                className={`p-2 rounded-lg ${
                  gameState.gameMode === "online"
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 cursor-pointer"
                } transition-colors duration-200`}
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Game Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {gameState.boards.map((board, boardIndex) => (
              <MiniBoard
                key={boardIndex}
                board={board}
                boardIndex={boardIndex}
                winner={gameState.boardWinners[boardIndex]}
                isActive={
                  gameState.activeBoard === null ||
                  gameState.activeBoard === boardIndex
                }
                isHighlighted={gameState.activeBoard === boardIndex}
                onCellClick={onCellClick}
                isGameOver={gameState.isGameOver}
                currentPlayer={gameState.currentPlayer}
              />
            ))}
          </div>

          {/* Game Result */}
          <AnimatePresence>
            {gameState.isGameOver && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-8 text-center"
              >
                <div
                  className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full text-lg font-bold ${
                    gameState.gameWinner
                      ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                      : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                  }`}
                >
                  {gameState.gameWinner ? (
                    gameState.gameMode === "bot" ? (
                      gameState.gameWinner === "x" ? (
                        <>
                          <User className="w-5 h-5" />
                          <span>You Won!</span>
                        </>
                      ) : (
                        <>
                          <Bot className="w-5 h-5" />
                          <span>Bot Won!</span>
                        </>
                      )
                    ) : (
                      <span>
                        {gameState.gameWinner === "opponent_left"
                          ? "You"
                          : "Opponent"}{" "}
                        Won!
                      </span>
                    )
                  ) : (
                    <span>It's a Draw!</span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            {gameState.activeBoard !== null
              ? `You must play in the highlighted board (${
                  gameState.activeBoard + 1
                })`
              : "You can play in any available board"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
