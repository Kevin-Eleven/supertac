const { Server } = require("socket.io");

class SocketService {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: "http://localhost:5173", // Vite's default port
        methods: ["GET", "POST"],
      },
    });
    this.rooms = new Map();
    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    this.io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);
      // Create a room with a given roomName
      socket.on("createRoom", ({ roomName }) => {
        // create a roomId
        const roomId = `room-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 15)}`;
        const room = {
          id: roomId,
          name: roomName,
          players: [
            {
              id: socket.id,
              symbol: "x",
            },
          ],
          gameState: null,
          currentTurn: null,
        };
        // map of roomId and room object
        this.rooms.set(roomId, room);
        socket.join(roomId);
        socket.emit("waitingForPlayer", { roomId });
      });

      // join a room
      socket.on("joinRoom", () => {
        // join a random room with available space
        const availableRooms = Array.from(this.rooms.values()).filter(
          (room) => room.players.length === 1
        );

        if (availableRooms.length === 0) {
          socket.emit("roomError", { message: "No available rooms" });
          return;
        }

        // Pick the first available room
        const room = availableRooms[0];

        // Add player to room
        const player = {
          id: socket.id,
          symbol: "o",
        };

        room.players.push(player);

        // Join the socket room
        socket.join(room.id);

        // If second player joins, start the game
        if (room.players.length === 2) {
          room.currentTurn = room.players[0].id;
          room.gameState = {
            boards: Array(9)
              .fill(null)
              .map(() => Array(9).fill(null)),
            boardWinners: Array(9).fill(null),
            activeBoard: null,
            isGameOver: false,
            gameWinner: null,
            roomId: room.id,
          };

          // Notify both players about game start and initial turn
          this.io.to(room.id).emit("gameStart", {
            gameState: room.gameState,
            players: room.players,
          });

          // Send initial turn information
          this.io.to(room.id).emit("turnChange", {
            currentTurn: room.currentTurn,
          });
        }
      });

      // Join room by ID
      socket.on("joinRoomById", ({ roomId }) => {
        const room = this.rooms.get(roomId);

        if (!room) {
          socket.emit("roomError", { message: "Room not found" });
          return;
        }

        if (room.players.length >= 2) {
          socket.emit("roomError", { message: "Room is full" });
          return;
        }

        // Add player to room
        const player = {
          id: socket.id,
          symbol: "o",
        };

        room.players.push(player);
        socket.join(roomId);

        // Start the game since we now have two players
        room.currentTurn = room.players[0].id;
        room.gameState = {
          boards: Array(9)
            .fill(null)
            .map(() => Array(9).fill(null)),
          boardWinners: Array(9).fill(null),
          activeBoard: null,
          isGameOver: false,
          gameWinner: null,
        };

        // Notify both players about game start
        this.io.to(roomId).emit("gameStart", {
          gameState: room.gameState,
          players: room.players,
        });
      });

      // Handle player moves
      socket.on("makeMove", ({ roomId, boardIndex, cellIndex }) => {
        const room = this.rooms.get(roomId);
        // this error is coming atp
        if (!room) {
          socket.emit("moveError", { message: "Room not found" });
          return;
        }

        // Verify it's the player's turn
        if (room.currentTurn !== socket.id) {
          socket.emit("moveError", { message: "Not your turn" });
          return;
        }

        // Get the player's symbol
        const currentPlayer = room.players.find((p) => p.id === socket.id);
        if (!currentPlayer) {
          socket.emit("moveError", { message: "Player not found" });
          return;
        }

        // Validate move
        if (
          !room.gameState ||
          room.gameState.boards[boardIndex][cellIndex] !== null ||
          room.gameState.boardWinners[boardIndex] !== null ||
          (room.gameState.activeBoard !== null &&
            room.gameState.activeBoard !== boardIndex) ||
          room.gameState.isGameOver
        ) {
          socket.emit("moveError", { message: "Invalid move" });
          return;
        }

        // Update game state
        room.gameState.boards[boardIndex][cellIndex] = currentPlayer.symbol;

        // Update the current player in game state
        room.gameState.currentPlayer = currentPlayer.symbol === "x" ? "o" : "x";

        // Check if the board was won
        const boardWinner = this.checkBoardWinner(
          room.gameState.boards[boardIndex]
        );
        if (boardWinner) {
          room.gameState.boardWinners[boardIndex] = boardWinner;

          // Check if the game was won
          const gameWinner = this.checkGameWinner(room.gameState.boardWinners);
          if (gameWinner) {
            room.gameState.gameWinner = gameWinner;
            room.gameState.isGameOver = true;
          }
        }

        // Update the active board
        room.gameState.activeBoard =
          room.gameState.boardWinners[cellIndex] === null ? cellIndex : null;

        // Switch turns
        room.currentTurn = room.players.find((p) => p.id !== socket.id).id;

        // First, send the updated game state to all players
        this.io.to(roomId).emit("moveMade", {
          gameState: room.gameState,
        });

        // Then, send the turn change notification
        this.io.to(roomId).emit("turnChange", {
          currentTurn: room.currentTurn,
        });

        // Also send a confirmation to the player who made the move
        socket.emit("moveConfirmed", {
          boardIndex,
          cellIndex,
          symbol: currentPlayer.symbol,
        });
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        // Find and clean up any rooms the player was in
        this.rooms.forEach((room, roomId) => {
          const playerIndex = room.players.findIndex((p) => p.id === socket.id);
          if (playerIndex !== -1) {
            room.players.splice(playerIndex, 1);
            if (room.players.length === 0) {
              this.rooms.delete(roomId);
            } else {
              this.io.to(roomId).emit("playerLeft", {
                message: "Opponent left the game",
              });
            }
          }
        });
      });
    });
  }

  // Helper function to check if a board has been won
  checkBoardWinner(board) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    // Check for draw
    if (board.every((cell) => cell !== null)) {
      return "draw";
    }

    return null;
  }

  // Helper function to check if the game has been won
  checkGameWinner(boardWinners) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        boardWinners[a] &&
        boardWinners[a] !== "draw" &&
        boardWinners[a] === boardWinners[b] &&
        boardWinners[a] === boardWinners[c]
      ) {
        return boardWinners[a];
      }
    }

    // Check for draw
    if (boardWinners.every((winner) => winner !== null)) {
      return "draw";
    }

    return null;
  }
}

module.exports = SocketService;
