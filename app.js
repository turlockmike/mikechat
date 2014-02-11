var express = require("express");
var app = express();
var port = process.env.PORT || 3000;

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', "jade");
  app.engine('jade', require('jade').__express);
  app.use(express.static(__dirname + '/public'));
})

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/:room", function(req, res) {
  res.render("show", {room: req.params.room});
});


function users() {
  var users = [];
  io.sockets.clients().forEach(function(client) {
    users.push({id: client.id, username: client.username});
  })
  return users;
}

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function(socket) {
  socket.emit('message', { message: 'Welcome to Chat' });
  socket.broadcast.emit("message", {message: "Someone has joined the room"})
  io.sockets.emit("users_updated", {users: users()});
  socket.on('send', function(data) {
    if (socket.username != data.username) {
      socket.broadcast.emit("message", {message: (socket.username || "Someone") + " has changed their nickname to " + data.username})
      socket.username = data.username;
      io.sockets.emit("users_updated", {users: users()});
    }
    if (socket.username.length > 0) {
      io.sockets.emit('message', data);
    } else {
      socket.emit("error", {message: "Username Required"});
    }
  });
  socket.on("name_updated", function(data) {
    if (socket.username != data.username) {
      socket.broadcast.emit("message", {message: (socket.username || "Someone") + " has changed their nickname to " + data.username})
      socket.username = data.username;
      io.sockets.emit("users_updated", {users: users()});
    }
  })

  socket.on("disconnect", function() {
    io.sockets.emit("message", {message: (socket.username || "Someone") + " has left the room"})
    io.sockets.emit("users_updated", {users: users()});
  })
});




console.log("Listening on port " + port);