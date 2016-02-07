var socketio = require('socket.io');
var restify = require('restify');

var server = restify.createServer();
var io = socketio.listen(server.server);

// var minerva = require('./modulas/minerva');
var oxford = require('project-oxford');

var key = require('./key.json');

var faceClient = new oxford.Client(key.ms.face);

var oxfordEmotion = require("node-oxford-emotion")(key.ms.emotion);

server.use(restify.bodyParser());

server.listen(process.env.VCAP_APP_PORT || 1314, function () {
  console.log('%s listening at %s', server.name, server.url);
});

function infoConcept(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  faceClient.face.detect({
      path: './assets/0.jpg',
      analyzesAge: true,
      analyzesGender: true
    })
    .then(function (response) {

      res.send(200, response);
    });
}

function imageHandler(req, res, next) {
  // Get the first_name value from the POSTed data
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  // var image = req.body;
  // console.log(req.body);
  // Send back the value they posted
  // var image = req.body.json; /* whatever */
  var data = JSON.parse(req.body.json);
  var img = data.data;
  // res.send(201, img);
  var base64data = img.replace(/^data:image\/png;base64,|^data:image\/jpeg;base64,|^data:image\/jpg;base64,|^data:image\/bmp;base64,/, '');
  //
  var buf = new Buffer(base64data, 'base64');
  // res.send(201, base64data);

  oxfordEmotion.recognize("image", buf, function (cb) {
    // console.log(cb);

    res.send(201, cb);
  });
}



var users = require('./users.json');

var nessie = require('./modulas/nessie');

// nessie.fetchCustomerInfo(users.customers[0].id);
// nessie.fetchMerchantInfo(users.merchants[0].id);
// nessie.getCustomerInfo(users.customers[0].id);

var c = users.customers[0];
var m = users.merchants[0];

var ci, mi;

function initTransaction(req, res, next) {

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  nessie.getCustomerInfo(c.id, function (customerInfo) {
    ci = JSON.parse(customerInfo);

    nessie.fetchMerchantInfo(m.id, function (merchantInfo) {
      mi = JSON.parse(merchantInfo);
      var data = {
        customer: ci,
        merchant: mi
      };
      res.send(200, data);
    });

  });
}

function makeTransaction(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  var amount = req.params.a;

  nessie.getCustomerInfo(c.id, function (customerInfo) {
    ci = JSON.parse(customerInfo);

    // console.log(ci);

    var cAccount = ci[0];

    // console.log(cAccount);
    // res.send(201, cAccount);
    nessie.makePurchase(cAccount, m, amount, function (transactionStatus) {
      res.send(201, JSON.parse(transactionStatus));
    });

  });

}

server.get('/mp/:a', makeTransaction);
server.get('/it', initTransaction);
server.post('/u', imageHandler);
server.get('/i', infoConcept);

io.sockets.on('connection', function (socket) {
  console.log('connection', socket.handshake.address);
  // io.emit('CONNECTED');
  socket.on('Receive Image Data', function (data, callback) {
    console.log(data);

    callback("Approved");
  });
});
