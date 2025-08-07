require('dotenv').config();

const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
const { serverHostPort, databaseURL } = require('./src/utils/constants');
const morgan = require('morgan');
const routes = require('./src/routes/index');
const mongoose = require('mongoose');
const ErrorHandle = require('./src/middlewares/errorHandle.middleware');
const cookieParser = require('cookie-parser');
const socket = require('./src/utils/socket');

mongoose.connect(databaseURL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const server = http.createServer(app);
socket.init(server);

// Configure CORS with origins from environment variable
const corsOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000'];
app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.get('/', (req, res) => {
  res.send('Hello HiepDevs! Server is running.');
});

app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.use(ErrorHandle.handleError);

server.listen(serverHostPort, () => {
  console.log(`Server is running on http://localhost:${serverHostPort}`);
});
