// socketController.js
const Room = require("../models/roomModel");

// Store shared locations for each user
const sharedLocationsByUser = {};

const handleConnection = (socket, io) => {
  console.log("Connected & Socket Id is ", socket.id);
  socket.emit("Data", "first emit");

  socket.on("Realtime", (data) => {
    console.log(data);
  });

  socket.on("TrackLocation", (data) => {
    try {
      console.log("Location data received:", data);

      // Store the shared location for the user
      sharedLocationsByUser[data.userId] = data;

      // Emit the shared location only to the specified user
      io.to(data.userId).emit("SharedLocation", data);
      console.log('Location data emitted to user.', data);

    } catch (error) {
      console.error('Error handling location data:', error.message);
    }
  });

  socket.on("disconnect", () => {
    // Handle disconnect event if needed
    console.log(`Socket ${socket.id} disconnected`);
  });

  // Join the user-specific room
  socket.on("joinUserRoom", (userId) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined room for user ${userId}`);

    // Emit shared locations for the joined user
    const sharedLocationForUser = sharedLocationsByUser[userId] || null;
    socket.emit("SharedLocation", sharedLocationForUser);
  });
};

module.exports = {
  handleConnection,
};
