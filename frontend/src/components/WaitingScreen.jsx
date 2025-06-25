import React from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

const WaitingScreen = ({ roomId }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Waiting for Player
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Share this room ID with your friend to play together
          </p>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
            <p className="text-lg font-mono text-gray-800 dark:text-gray-200 select-all">
              {roomId}
            </p>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default WaitingScreen;
