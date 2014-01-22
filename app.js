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

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {
  console.info("connected")
  socket.emit('message', { message: 'Welcome to Chat' });
  socket.on('send', function (data) {
    io.sockets.emit('message', data);
  });
});

console.log("Listening on port " + port);