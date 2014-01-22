var express = require("express");
var app = express();
var port = process.env.PORT || 3000;


app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', "jade");
  app.engine('jade', require('jade').__express);
  app.use(express.static(__dirname + '/public'));
})

app.get("/", function(req, res){
  res.render("index");
});

app.get("/:room", function(req, res){
  res.render("show", {room: req.params.room});
});

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {
  socket.emit('message', { message: 'Welcome to Chat' });
  socket.broadcast.emit("message", {message: "Someone has joined the room"})
  socket.on('send', function (data) {
    socket.current_username = data.username;
    io.sockets.emit('message', data);
  });
  socket.on("disconnect", function() {
    io.sockets.emit("message", {message: (socket.current_username || "Someone") + " has left the room"})
  })
});


console.log("Listening on port " + port);