require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/userRoute');
const errorHandler = require('./middleware/errorMiddleware');
const http = require('http');
const socketIO = require('socket.io');
const socketController = require('./controllers/socketController');
const socketRoutes = require('./routes/socketRoutes');

const app = express();
const httpServer = http.createServer(app);

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000,https://meek-babka-71c876.netlify.app/,http://192.168.1.6:3000';

const io = new socketIO.Server(httpServer, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socketController.handleConnection(socket, io);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(
  cors({
    origin: corsOrigin.split(','),
    credentials: true,
  })
);

app.use('/api/users', userRoute);
app.use("/socket", socketRoutes);

app.get('/', (req, res) => {
  res.send('Home Page');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI).then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

exports.io = io;
