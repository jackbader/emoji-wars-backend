const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors"); // Import cors

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://emoji-wars-e9ssw21sc-jba-pplications.vercel.app/",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173",
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

server.listen(4000, () => {
  console.log("Server running on port 4000");
});
