import { useState, useEffect } from "react";
import socketService from "../services/socketService";
import { Copy } from "lucide-react";
import { motion } from "framer-motion";

const MultiplayerLobby = ({ gameState }) => {
  const roomId = gameState.roomId || "default-room-id"; // Replace with actual room ID logic

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Room Created Successfully
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Waiting for other player to join...
        </p>
        <motion.div
          className={`
                  bg-white dark:bg-gray-800 rounded-xl p-6 border-2 cursor-pointer transition-all duration-200
                  
                `}
        >
          <div className="flex items-center space-x-4">
            <div className="text-left flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white"></h3>
              <p className="text-black text-2xl font-bold dark:text-gray-300">
                {roomId}
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-12 h-12 rounded-lg flex items-center justify-center`}
            >
              <Copy className="w-6 h-6 text-black dark:text-white" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MultiplayerLobby;
