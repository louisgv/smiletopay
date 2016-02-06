var socketio = require('socket.io');
var restify = require('restify');

var server = restify.createServer();
var io = socketio.listen(server.server);

var minerva = require('./modulas/minerva');
var oxford = require('project-oxford');

var key = require('./key.json');

var faceClient = new oxford.Client(key.ms.face);

server.use(restify.bodyParser());

server.listen(process.env.VCAP_APP_PORT || 1314, function () {
  console.log('%s listening at %s', server.name, server.url);
});


function infoConcept(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  client.face.detect({
      path: 'assets/0.jpg',
      analyzesAge: true,
      analyzesGender: true
    })
    .then(function (response) {
      console.log('The age is: ' + response[0].attributes.age);
      console.log('The gender is: ' + response[0].attributes.gender);
      res.send(200, JSON.parse(response));
    });
}

server.get('/f/:i', postImage);

server.get('/i', infoConcept);

io.sockets.on('connection', function (socket) {
  // Define a helper function to return the count.

});
