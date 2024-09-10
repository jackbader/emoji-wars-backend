const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv"); // Import dotenv

// Load environment variables from .env file
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // Use environment variable for CORS origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Enable CORS with environment variable
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

let players = [];

io.on("connection", (socket) => {
  console.log("A player connected");

  socket.on("playerMoved", (playerData) => {
    players = players.filter((p) => p.id !== socket.id); // Remove old data
    players.push({ id: socket.id, ...playerData }); // Add new data

    io.emit("updatePlayers", players); // Broadcast to all players
  });

  socket.on("disconnect", () => {
    console.log("A player disconnected");
    players = players.filter((p) => p.id !== socket.id);
    io.emit("updatePlayers", players);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
