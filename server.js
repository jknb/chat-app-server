const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 4001;

const app = express();

// Server instance
const server = http.createServer(app);

// Creates a socket using the instane of the server
const io = socketIO(server);

let users = [];

io.on('connection', socket => {
  console.log('User connected');

  socket.on('new user', username => {
    socket.username = username;
    users.push({username});
    io.emit('new user', username);
  })
  
  socket.on('new message', (message) => {
    io.emit('new message', {username: socket.username, message});
  })

  socket.on('disconnect', () => {
    console.log(`User ${socket.username} disconnected`);
  });
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));