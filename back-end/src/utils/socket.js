// src/utils/socket.js
const { Server } = require('socket.io');
let io;

function init(server) {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('joinRoom', (userId) => {
            if (userId) {
                socket.join(userId.toString());
                console.log(`User ${userId} joined room`);
            } else {
                console.error('User ID is null or undefined');
            }
        });

        socket.on('newOrder', (order) => {
            console.log('new order', order);
            io.emit('newOrder', order);
        });
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });

    return io;
}

function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
}

module.exports = { init, getIO };
