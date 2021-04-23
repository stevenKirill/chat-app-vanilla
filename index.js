const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const moment = require('moment');
const server = http.createServer(app);
const io = require('socket.io')(server);
const chatUsers = require('./users');

const BOT_NAME = "BOT";

app.use(express.static('client'));

io.on('connection', (socket) => {
    // подсоединение к комнате
    socket.on('joinRoom',(data) => {
        const userToSave = {
            ...data,
            id: socket.id
        };
        chatUsers.addUser(userToSave);
        socket.join(data.room);

        // сообщение текущему пользователю
        socket.emit('message',{
            user_name: BOT_NAME,
            message: 'Welcome to chat',
            time: moment().format("h:mm a")
        });

        // Сообщение всем кроме текущего пользователя
        socket.broadcast.to(data.room).emit('message', {
            user_name: BOT_NAME,
            message: `${data.user_name} joined chat`,
            time: moment().format("h:mm a")
        });

        // пользователи комнаты
        io.to(data.room).emit('room users', {
            users: chatUsers.getRoomUsers(data.room),
            room: data.room,
        });
    });

    // cообщения в чат
    socket.on('chat message', (data) => {
        const currUser = chatUsers.getCurrentUser(socket.id);
        io.to(currUser.room).emit('chat message',{
            ...currUser,
            message: data.message,
            time : moment().format("h:mm a")
        });
    });

    // уход пользователя
    socket.on('disconnect',() => {
        const currUser = chatUsers.getCurrentUser(socket.id);
        chatUsers.deleteUser(socket.id)
        const otherUsers = chatUsers.getRoomUsers(currUser.room);
        socket.broadcast.to(currUser.room).emit('message', {
            user_name: BOT_NAME,
            message: `${currUser.user_name} left chat`,
            time: moment().format("h:mm a"),
        })
        socket.broadcast.to(currUser.room).emit('user left', {
            users: otherUsers
        })
    });
});

server.listen(4000, () => {
    console.log('server started blash')
});