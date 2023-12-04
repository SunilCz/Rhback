// socketController.js
const Room = require("../models/roomModel");

const handleConnection = (socket, io) => {
  console.log("Connected & Socket Id is ", socket.id);
  socket.emit("Data", "first emit");

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
}  
module.exports = {
  handleConnection,
};
