const express = require('express');
const path = require('path');
const app = express();
const socket = require('socket.io');

const messages = [];
const users = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);



io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);

    socket.on('login', (login) => {
        users.push({name: login, id: socket.id})
        socket.broadcast.emit('message', {author: 'Chat Bot', content: `${login} has joined the conversation`});
    });
    
    socket.on('message', (message) => {
        console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
      });
      
    socket.on('disconnect', () => { 
        console.log('Oh, socket ' + socket.id + ' has left');
        const user = users.find(object => object.id === socket.id)
        const index = users.indexOf(user);
        users.splice(index, 1);
        socket.broadcast.emit('message', {author: 'Chat Bot', content: `${user.name} has left the conversation` });

    });
    console.log('I\'ve added a listener on message event \n');
});
  