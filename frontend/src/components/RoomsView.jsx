import { useState, useEffect } from "react";
import { Brain, Zap, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useGame } from "../hooks/useGame"; // Adjust the import path as necessary
import socketService from "../services/socketService"; // Adjust the import path as necessary

const RoomsView = ({ onPlayRandom, onCreateRoom, onBack, onJoinRoom }) => {
  const [roomName, setRoomName] = useState("");
  const [roomIdToJoin, setRoomIdToJoin] = useState("");

  const [connectionStatus, setConnectionStatus] = useState({
    isConnected: false,
    socketId: null,
  });

  useEffect(() => {
    // Connect to socket server when component mounts
    socketService.connect();

    // Check connection status every second
    const interval = setInterval(() => {
      setConnectionStatus(socketService.getConnectionStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Play against other players
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Create a room, join with room ID, or play with a random player
        </p>

        {/* Create Room Section */}
        <div className="flex space-x-4 justify-center mb-8 items-center">
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter Room Name"
            className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-1 dark:border-black"
          />
          <button
            onClick={() => onCreateRoom(roomName)}
            disabled={!roomName}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Create Room
          </button>
        </div>

        {/* Join Room Section */}
        <div className="flex space-x-4 justify-center mb-8 items-center">
          <input
            type="text"
            value={roomIdToJoin}
            onChange={(e) => setRoomIdToJoin(e.target.value)}
            placeholder="Enter Room ID"
            className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-1 dark:border-black"
          />
          <button
            onClick={() => onJoinRoom(roomIdToJoin)}
            disabled={!roomIdToJoin}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Join Room
          </button>
        </div>

        {/* Navigation Buttons */}
        <div className="flex space-x-4 justify-center">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            Back
          </button>
          <button
            onClick={() => onPlayRandom()}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
          >
            Play Random
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RoomsView;
