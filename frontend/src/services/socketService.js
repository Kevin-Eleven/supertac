import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    if (!this.socket) {
      const backendUrl =
        import.meta.env.VITE_API_URL || "http://localhost:3000";
      this.socket = io(backendUrl, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });
      this.setupBaseHandlers();
    }

    return this.socket;
  }

  setupBaseHandlers() {
    this.socket.on("connect", () => {
      console.log("🟢 Connected to game server");
      this.isConnected = true;
    });

    this.socket.on("connect_error", (error) => {
      console.error("🔴 Connection error:", error.message);
      this.isConnected = false;
    });

    this.socket.on("disconnect", () => {
      console.log("🔴 Disconnected from game server");
      this.isConnected = false;
    });
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id,
    };
  }

  // no callback being passed from the frontend
  joinRoom() {
    this.socket.emit("joinRoom");
  }
  joinRoomById(roomId, callback) {
    this.socket.emit("joinRoomById", { roomId });
  }
  // In socketService.js
  createRoom(roomName, callback) {
    this.socket.emit("createRoom", { roomName });
    this.socket.once("waitingForPlayer", ({ roomId }) => {
      callback(roomId);
    });
  }

  makeMove(roomId, boardIndex, cellIndex) {
    this.socket.emit("makeMove", { roomId, boardIndex, cellIndex });
  }

  // onWaitingForPlayer() {
  //   this.socket.on("waitingForPlayer", ({ roomId }) => {
  //     return roomId;
  //   });
  // }

  onGameStart(callback) {
    this.socket.on("gameStart", callback);
  }

  onMoveMade(callback) {
    this.socket.on("moveMade", callback);
  }

  onMoveConfirmed(callback) {
    this.socket.on("moveConfirmed", callback);
  }

  onTurnChange(callback) {
    this.socket.on("turnChange", callback);
  }

  onPlayerLeft(callback) {
    this.socket.on("playerLeft", callback);
  }

  onRoomError(callback) {
    this.socket.on("roomError", callback);
  }

  onMoveError(callback) {
    this.socket.on("moveError", callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// Create a singleton instance for shared state of socket connection
// This allows multiple components to use the same socket connection without creating new instances

const socketService = new SocketService();
export default socketService;
