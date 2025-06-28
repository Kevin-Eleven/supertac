const express = require("express");
const http = require("http");
const cors = require("cors");
const SocketService = require("./services/socketService");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Initialize socket service
const socketService = new SocketService(server);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to the SuperTac API. The backend is up and running");
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
