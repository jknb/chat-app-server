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
  const usernames = users.map(user => user.username);
  console.log(`Socket connected. Socket ID: ${socket.id}, username: ${socket.username}`);
  console.log(`Total users: ${usernames}`);
  
  socket.emit('users_online', usernames);

  socket.on('new_username', username => {
    socket.username = username;
    users.push({username, id: socket.id});
    io.emit('new_username', username);
  })
  
  socket.on('new_message', (message) => {
    io.emit('new_message', {username: socket.username, message});
  })

  socket.on('disconnect', () => {
    console.log(`User ${socket.username} disconnected`);
    
    const indexOfDC = users.findIndex(user => user.id === socket.id);
    if (indexOfDC > -1) {
      users.splice(indexOfDC, 1);
      const usernames = users.map(user => user.username);
      io.emit('users_online', usernames);
    }; 
  });
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));