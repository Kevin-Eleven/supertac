import React from "react";
import { motion } from "framer-motion";
import { X, Circle, Trophy } from "lucide-react";

const MiniBoard = ({
  board,
  boardIndex,
  winner,
  isActive,
  isHighlighted,
  onCellClick,
  isGameOver,
  currentPlayer,
}) => {
  const renderCellContent = (cellValue) => {
    if (cellValue === "x") {
      return <X className="w-8 h-8 text-blue-600" strokeWidth={3} />;
    }
    if (cellValue === "o") {
      return <Circle className="w-8 h-8 text-red-600" strokeWidth={3} />;
    }
    return null;
  };

  const getBoardStatus = () => {
    if (winner && winner !== "draw") {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`absolute inset-0 flex items-center justify-center ${
            winner === "x"
              ? "bg-blue-600/90 text-white"
              : "bg-red-600/90 text-white"
          } rounded-lg backdrop-blur-sm`}
        >
          <div className="text-center">
            <Trophy className="w-10 h-10 mx-auto mb-1" />
            <div className="text-6xl font-bold">{winner}</div>
          </div>
        </motion.div>
      );
    }

    if (winner === "draw") {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-600/90 text-white rounded-lg backdrop-blur-sm">
          <div className="text-xl font-bold">Draw</div>
        </div>
      );
    }

    return null;
  };

  const canPlay = isActive && !winner && !isGameOver;

  return (
    <motion.div
      whileHover={canPlay ? { scale: 1.02 } : {}}
      className={`
        relative rounded-lg border-2 transition-all duration-200 p-2
        ${
          isHighlighted && !winner
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg"
            : canPlay
            ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-400 hover:shadow-md"
            : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
        }
      `}
    >
      <div className="grid grid-cols-3 gap-1 aspect-square">
        {board.map((cell, cellIndex) => (
          <motion.button
            key={cellIndex}
            whileHover={canPlay && !cell ? { scale: 1.1 } : {}}
            whileTap={canPlay && !cell ? { scale: 0.95 } : {}}
            onClick={() =>
              canPlay && !cell && onCellClick(boardIndex, cellIndex)
            }
            disabled={!canPlay || !!cell}
            className={`
              aspect-square rounded border flex items-center justify-center transition-all duration-200
              ${
                canPlay && !cell
                  ? "border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 cursor-pointer"
                  : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
              }
            `}
          >
            <motion.div
              initial={cell ? { scale: 0 } : {}}
              animate={cell ? { scale: 1 } : {}}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {renderCellContent(cell)}
            </motion.div>
          </motion.button>
        ))}
      </div>

      {getBoardStatus()}

      {/* Board number indicator */}
      <div className="absolute -top-2 -left-2 w-6 h-6 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 rounded-full flex items-center justify-center text-xs font-bold">
        {boardIndex + 1}
      </div>
    </motion.div>
  );
};

export default MiniBoard;
