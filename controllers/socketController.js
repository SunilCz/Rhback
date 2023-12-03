const Room = require("../models/roomModel");

// Maintain a mapping of socket.id to userId and room associations
const socketIdToUserIdMap = {};
const socketIdToRoomMap = {};

const handleConnection = (socket, io) => {
  console.log("Connected & Socket Id is ", socket.id);
  socket.emit("Data", "first emit");

  // Receive the userId and roomId as part of the connection handshake
  socket.on("connectUser", ({ userId, roomId }) => {
    // Associate the userId and roomId with the socket connection
    socketIdToUserIdMap[socket.id] = userId;
    socketIdToRoomMap[socket.id] = roomId;
    
    // Join the room
    socket.join(roomId);

    console.log(`User with ID ${userId} connected to room ${roomId}.`);

    // You might emit additional events or perform other actions here if needed.
  });

  socket.on("Realtime", (data) => {
    console.log(data);
  });

  socket.on("TrackLocation", (data) => {
    try {
      console.log("Location data received:", data);

      // Broadcast the location data to all clients in the same room
      io.to(socketIdToRoomMap[socket.id]).emit("LocationUpdate", data);
      console.log('Location data emitted to all clients in the same room.', data);

    } catch (error) {
      console.error('Error handling location data:', error.message);
    }
  });

  // Handle disconnection and remove the mapping
  socket.on("disconnect", () => {
    const userId = socketIdToUserIdMap[socket.id];
    const roomId = socketIdToRoomMap[socket.id];
    
    delete socketIdToUserIdMap[socket.id];
    delete socketIdToRoomMap[socket.id];

    // Leave the room
    socket.leave(roomId);

    console.log(`User with ID ${userId} disconnected from room ${roomId}.`);
  });
}

module.exports = {
  handleConnection,
};
