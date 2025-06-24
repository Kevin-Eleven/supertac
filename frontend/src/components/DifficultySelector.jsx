import { useState } from "react";
import { Brain, Zap, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useGame } from "../hooks/useGame"; // Adjust the import path as necessary
const DifficultySelector = ({
  selectedDifficulty,
  onSelect,
  onStart,
  onBack,
}) => {
  const difficulties = [
    {
      level: "easy",
      name: "Easy",
      description: "Random moves, perfect for beginners",
      icon: Zap,
      color: "green",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      textColor: "text-green-600 dark:text-green-400",
      borderColor: "border-green-200 dark:border-green-700",
      selectedBg: "bg-green-50 dark:bg-green-900/20",
      selectedBorder: "border-green-500 dark:border-green-400",
    },
    {
      level: "medium",
      name: "Medium",
      description: "Smart strategies with occasional mistakes",
      icon: Brain,
      color: "orange",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      textColor: "text-orange-600 dark:text-orange-400",
      borderColor: "border-orange-200 dark:border-orange-700",
      selectedBg: "bg-orange-50 dark:bg-orange-900/20",
      selectedBorder: "border-orange-500 dark:border-orange-400",
    },
    {
      level: "hard",
      name: "Hard",
      description: "Optimal moves using advanced algorithms",
      icon: Target,
      color: "red",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      textColor: "text-red-600 dark:text-red-400",
      borderColor: "border-red-200 dark:border-red-700",
      selectedBg: "bg-red-50 dark:bg-red-900/20",
      selectedBorder: "border-red-500 dark:border-red-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Choose Difficulty
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Select the AI difficulty level that matches your skill
        </p>

        <div className="grid gap-4 mb-8">
          {difficulties.map((difficulty) => {
            const Icon = difficulty.icon;
            const isSelected = selectedDifficulty === difficulty.level;

            return (
              <motion.div
                key={difficulty.level}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(difficulty.level)}
                className={`
                  bg-white dark:bg-gray-800 rounded-xl p-6 border-2 cursor-pointer transition-all duration-200
                  ${
                    isSelected
                      ? `${difficulty.selectedBg} ${difficulty.selectedBorder} shadow-lg`
                      : `${difficulty.borderColor} hover:${difficulty.selectedBg} hover:shadow-md`
                  }
                `}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`${difficulty.bgColor} w-12 h-12 rounded-lg flex items-center justify-center`}
                  >
                    <Icon className={`w-6 h-6 ${difficulty.textColor}`} />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {difficulty.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {difficulty.description}
                    </p>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`w-6 h-6 rounded-full ${difficulty.textColor} border-2 border-current flex items-center justify-center`}
                    >
                      <div className="w-2 h-2 bg-current rounded-full" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex space-x-4 justify-center">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            Back
          </button>
          <button
            onClick={onStart}
            disabled={!selectedDifficulty}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Start Game
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DifficultySelector;
