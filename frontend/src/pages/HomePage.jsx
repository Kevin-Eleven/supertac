import React from "react";
import { Bot, Users, Trophy, Zap } from "lucide-react";
import { motion } from "framer-motion";

const HomePage = ({ onPlayBot, onPlayMultiplayer }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center p-4">
      <motion.div
        className="max-w-4xl mx-auto text-center"
        initial="hidden"
        animate="visible"
      >
        <motion.div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to SuperTac
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Master the ultimate strategy game where every move matters. Nine
            boards, infinite possibilities.
          </p>
        </motion.div>

        <motion.div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Play vs Bot Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 cursor-pointer group"
            onClick={onPlayBot}
          >
            <div className="bg-orange-100 dark:bg-orange-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors duration-200">
              <Bot className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Play vs Bot
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Challenge AI opponents with three difficulty levels. Perfect your
              strategy against intelligent bots.
            </p>
            <div className="flex items-center justify-center space-x-2 text-orange-600 dark:text-orange-400 font-semibold">
              <Zap className="w-5 h-5" />
              <span>Start Playing</span>
            </div>
          </motion.div>

          {/* Online Multiplayer Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 cursor-pointer group"
            onClick={onPlayMultiplayer}
          >
            <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors duration-200">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Online Multiplayer
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Connect with players worldwide. Real-time matches, rankings, and
              competitive gameplay.
            </p>
            <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400 font-semibold">
              <Trophy className="w-5 h-5" />
              <span>Join Match</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            How to Play
          </h3>
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">
                1
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Win small boards to claim them
              </p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">
                2
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Your move determines the next board
              </p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">
                3
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Win three boards in a row to win!
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;
