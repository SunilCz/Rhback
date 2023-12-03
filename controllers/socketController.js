// socketController.js
const Room = require("../models/roomModel");

// Maintain a mapping of socket.id to userId
const socketIdToUserIdMap = {};

const handleConnection = (socket, io) => {
  console.log("Connected & Socket Id is ", socket.id);
  socket.emit("Data", "first emit");

  // Receive the userId as part of the connection handshake
  socket.on("connectUser", (userId) => {
    // Associate the userId with the socket connection
    socketIdToUserIdMap[socket.id] = userId;
    console.log(`User with ID ${userId} connected.`);

    // You might emit additional events or perform other actions here if needed.
  });

  socket.on("Realtime", (data) => {
    console.log(data);
  });

  socket.on("TrackLocation", (data) => {
    try {
      console.log("Location data received:", data);

      // Broadcast the location data to all connected clients
      io.emit("LocationUpdate", data);
      console.log('Location data emitted to all connected clients.', data);

    } catch (error) {
      console.error('Error handling location data:', error.message);
    }
  });

  // Handle disconnection and remove the mapping
  socket.on("disconnect", () => {
    const userId = socketIdToUserIdMap[socket.id];
    delete socketIdToUserIdMap[socket.id];
    console.log(`User with ID ${userId} disconnected.`);
  });
}

module.exports = {
  handleConnection,
};
