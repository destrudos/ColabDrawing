const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let canvasState = [];

io.on('connection', (socket) => {
    console.log('A user connected');

    // Send the current canvas state to the new user
    socket.emit('canvasState', canvasState);

    socket.on('draw', (data) => {
        canvasState.push(data);
        io.emit('draw', data);
    });

    socket.on('erase', (data) => {
        canvasState.push(data);
        io.emit('erase', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
