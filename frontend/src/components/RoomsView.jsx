import { useState, useEffect } from "react";
import { Brain, Zap, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useGame } from "../hooks/useGame"; // Adjust the import path as necessary
import socketService from "../services/socketService"; // Adjust the import path as necessary

const RoomsView = ({
  onPlayRandom,
  onCreateRoom,
  onBack,
  onJoinRoom,
  joiningRoom,
}) => {
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
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 cursor-pointer group"
        // onClick={onPlayMultiplayer}
      >
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

          <div className="flex flex-col space-y-6 mb-8 items-start w-full max-w-xl">
            {/* Create Room Section */}
            <div className="flex w-full space-x-4 items-center">
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter Room Name"
                className="px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md border dark:border-black focus:outline-none focus:ring-2 w-3/4"
              />
              <button
                onClick={() => onCreateRoom(roomName)}
                disabled={!roomName}
                className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 w-1/4"
              >
                Create
              </button>
            </div>

            {/* Join Room Section */}
            <div className="flex w-full space-x-4 items-center">
              <input
                type="text"
                value={roomIdToJoin}
                onChange={(e) => setRoomIdToJoin(e.target.value)}
                placeholder="Enter Room ID"
                className="px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md border dark:border-black focus:outline-none focus:ring-2 w-3/4"
              />
              <button
                onClick={() => onJoinRoom(roomIdToJoin)}
                disabled={!roomIdToJoin}
                className="px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 w-1/4"
              >
                Join
              </button>
            </div>
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
      </motion.div>
    </div>
  );
};

export default RoomsView;
