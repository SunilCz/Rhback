// socketController.js
const Room = require("../models/roomModel");

// Store shared location data
const sharedLocations = {};


const handleConnection = (socket, io) => {
  console.log("Connected & Socket Id is ", socket.id);
  socket.emit("Data", "first emit");

  socket.on("Realtime", (data) => {
    console.log(data);
  });

  socket.on("ShareLocation", (data) => {
    try {
      console.log("Location data received:", data);

      // Store the shared location data
      sharedLocations[data.userId] = data;

      // Broadcast the location data to all connected clients
      io.emit("SharedLocation", data);
      console.log('Location data emitted to all connected clients.', data);

    } catch (error) {
      console.error('Error handling location data:', error.message);
    }
  });

  socket.on("TrackLocation", (userId) => {
    try {
      // Retrieve the shared location data for the specified user
      const locationData = sharedLocations[userId];

      if (locationData) {
        // Send the location data to the tracking client
        socket.emit("TrackedLocation", locationData);
        console.log('Tracked location data sent to the client.', locationData);
      } else {
        console.log('Location data not found for user:', userId);
      }

    } catch (error) {
      console.error('Error handling track location request:', error.message);
    }
  });
};

module.exports = {
  handleConnection,
};
