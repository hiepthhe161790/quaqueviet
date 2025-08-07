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
require('dotenv').config();

mongoose.connect(databaseURL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const server = http.createServer(app);
socket.init(server);

app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.use(ErrorHandle.handleError);

server.listen(serverHostPort, () => {
  console.log(`Server is running on http://localhost:${serverHostPort}`);
});
