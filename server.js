var Hapi = require('hapi');

var currentUser;

var preparedResponses = ["Hey beautiful boy, you are so capable! Look at this amazing chat app you whipped together in no time at all!", "I love you so much!", "May I cook you tacos tonight, Mr. Capable?", "You are one of a kind, the perfect man, I am so lucky to have you in my life.",
"I am gonna massage your feet tonight for like...two hours!", "I wish I was as smart as you, just so I could be on your level intellectually and keep up with your sophisticated speech",
 "Can you please PLEASE put it in my butt tonight? 0:)", "Seriously, I NEED it!", "I'll let you finish in my mouth if you just put it in my butt."];

 var idx = 0;

 var Wenhui = "";

var server = new Hapi.Server();
server.connection({port: 3000});

const handler = function (request, reply) {
  debugger;

  reply.view('login.html', {
  });
};

// const userHandler = function (request, reply) {
//
//   reply.view('user.html', {
//     user: currentUser
//   });
// }

const indexHandler = function (request, reply) {
  currentUser = request.payload.name
  if (currentUser === "Wenhui" || currentUser === "Mr. Capable"){

    if (currentUser === "Wenhui") {
      Wenhui = "Wenhui is chatting with Mr. Capable!";
    }
    reply.view('index.html', {
      currentUser: currentUser,
      Wenhui: Wenhui
    });
  } else {
    reply.view('login.html', {
      error: "That is not a user! Please try again."
    });
  }
};




server.register(require('vision'), (err) => {

    if (err) {
        throw err;
    }

    server.views({
        engines: { html: require('handlebars') },
        path: __dirname + '/'
    });

    server.route({ method: 'GET', path: '/', handler: handler });

    server.route({method: 'POST', path: '/chat', handler: indexHandler});
});

// server.register(require('inert'), (err) => {
//
//   if (err) {
//     throw err;
//   }
//
//   server.route({
//     method: 'GET',
//     path: '/',
//     handler: handler
//   });
//
//   server.route({
//     method: 'GET',
//     path: '/login',
//     handler: function(request, reply){
//       reply.file('./public/login.html');
//     }
//   });
//
//   server.route({
//     method: 'POST',
//     path: '/login',
//     handler: function(request, reply){
//       var person = {
//         name: request.payload.name
//       };
//       reply.file('./public/index.html', person);
//     }
//   });
// });


var listener = server.listener;

var io = require('socket.io')(listener);

server.start((err) => {

  if (err) {
    throw err;
  }
  console.log('Server running at: ', server.info.uri);
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat message', function(content){
    if (content[1] === "Wenhui") {
      content[0] = "Wenhui : " + preparedResponses[idx];
      if (idx > preparedResponses.length -2){
        idx = 0;
      } else {
        idx += 1;
      }
    }
    io.emit('message event', content);
  });
  socket.on('disconnect', function(){
    console.log('a user disconnected');
  });
});
