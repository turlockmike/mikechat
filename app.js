/**
 * Module dependencies.
 */

var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , routes = require('./routes')
  , path = require('path')
  , io = require('socket.io').listen(server);

var clients = [];

var sendMessages = function(msg) {
  for (var i = 0; i < clients.length; i++) {
    clients[i].emit('news', { text: msg});
  }
};

io.configure(function() {
  io.set("transports", ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
  io.set("polling duration", 10);
});

io.sockets.on('connection', function(socket) {
  var index = clients.push(socket) - 1;
  socket.emit('news', { text: 'Hello World' });
  socket.on('message', function(data) {
    sendMessages(data.text);
  });
  socket.on("disconnect", function() {
    clients.splice(index, 1);
  });

});

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/views/index.html');
});
var port = process.env.PORT || 3000;
server.listen(port);