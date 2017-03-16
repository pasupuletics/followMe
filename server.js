var fs = require('fs');
var path = require('path');
var express = require('express');  
var app = express();  
var https = require('https');

var options = {
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem'))
};

var server = https.createServer(options, app);  
var io = require('socket.io')(server);

var APP_SRC = path.join(__dirname, 'app');
var buddies = {};

app.use(express.static(path.join(__dirname, 'node_modules')));  
app.use(express.static(path.join(__dirname, 'app')));  


app.get('/', function(req, res, next) {  
  res.sendFile(path.join(APP_SRC, 'index.html'));
});

app.get('/maps', function(req, res, next) {  
  res.sendFile(path.join(APP_SRC, 'maps.html'));
});

app.get('/buddies', function(req, res, next) {
  res.json(buddies);
});

app.get('/buddy', function(req, res, next) {
  var ns = createBuddy(/*req.query.id*/);
  res.json({status: 'success', nameSpace: ns.name});
});

/*
io.on('connection', function(socket) {  
  console.log('Client connected...::', socket.id);

  socket.emit('fm:connected', socket.id);

  socket.on('fm:locationChanged', function(data) {
    socket.broadcast.emit('fm:locationSync', data);
  });

  socket.on('disconnect', function () {
    delete buddies[this.id];
    console.log('A user disconnected');
  });

});
*/

server.listen(5000, function() {
  console.log('Listening at: http://localhost:5000');
});

function createBuddy(/*id*/) {
  var ns = '/fm:' + (''+Math.random()).substr(2),
    nsp = io.of(ns);

  buddies[ns] = true;

  nsp.on('connection', function(socket){

    socket.on('fm:locationChanged', function(data) {
      console.log(data);
      socket.broadcast.emit('fm:locationSync', data);
    });

  });
  
  return  nsp
}
