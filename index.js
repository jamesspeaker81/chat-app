var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({port: 3000});

var listener = server.listener;

var io = require('socket.io')(listener);

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply){
    reply('Hello, world');
  }
});

server.start((err) => {

  if (err) {
    throw err;
  }
  console.log('Server running at: ', server.info.uri);
});

// app.get('/', function(req, res) {
//   res.sendFile(__dirname + '/index.html');
// });

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat message', function(message, user){
    io.emit('message event', message, user);
  });
  socket.on('disconnect', function(){
    console.log('a user disconnected');
  });
});

// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });
