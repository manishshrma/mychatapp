const http = require("http");
const path = require("path");
const express = require("express");
const app = express();
const socket = require("socket.io");
const server = http.createServer(app);
const io = socket(server);
const formatMessage = require("./utils/messages");
const { userjoin, getuser, userLeave, getRoomUsers } = require("./utils/users");
const port=process.env.PORT||3000;
app.use(express.static(path.join(__dirname, "frontend")));


const botname = "chatcord bot!!";
io.on("connection", (socket) => {
  console.log("New connection   " + socket.id);

  socket.on("joinRoom", ({ username, room }) => {
    //  i passed the username and room from script client

    const user = userjoin(socket.id, username, room);

    socket.join(user.room);

    socket.emit("message", formatMessage(botname, "welcome to chatboard"));

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botname, `${user.username} has joined the chat`)
      );

    // send user and room infos

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // listen for chat messages

  socket.on("chatmessage", (msg) => {
    //2
    const user = getuser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {

      io.to(user.room).emit("message",formatMessage(botname, `${user.username} has left the chat`)
      );

    }
    // send user and room infos

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });
});

server.listen(port, () => {
  console.log(`server start ${port}`);
});