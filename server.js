const express = require('express'), path = require('path'), app = express(), http = require('http').Server(app), io = require('socket.io')(http), cookieParser = require('cookie-parser');
const settings = {port: 3001, ip: "127.0.0.1"};

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static(__dirname + "/resources"));

app.get("/", function(req, res) { res.end(); });

http.listen(settings.port, settings.ip, function() {
  console.log("[server.js] Listening on port " + settings.port);
});

require("./game/Server.js");
require("./game/GoogleAuth.js");
require("./game/Gen3DPlayer.js");

Server.setup(io);
